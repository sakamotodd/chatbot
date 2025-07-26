import { Server, Socket } from 'socket.io';
import logger from '../utils/logger';

export interface ConversationMessage {
  conversation_id: number;
  user_id: string;
  message_type: 'user' | 'bot' | 'system';
  content: any;
  timestamp: Date;
  node_id?: number;
}

export interface ConversationEvent {
  type: 'message' | 'status_change' | 'node_change' | 'error';
  conversation_id: number;
  user_id: string;
  data: any;
  timestamp: Date;
}

export class WebSocketService {
  private static io: Server;
  private static connectedUsers = new Map<string, Set<string>>(); // userId -> Set of socketIds

  static initialize(io: Server) {
    this.io = io;
    this.setupEventHandlers();
  }

  private static setupEventHandlers() {
    this.io.on('connection', (socket: Socket) => {
      logger.info(`WebSocket client connected: ${socket.id}`);

      // Handle user authentication/identification
      socket.on('authenticate', (data: { user_id: string; conversation_id?: number }) => {
        const { user_id, conversation_id } = data;
        
        if (!user_id) {
          socket.emit('error', { message: 'User ID is required' });
          return;
        }

        // Store user connection
        socket.data.user_id = user_id;
        socket.data.conversation_id = conversation_id;

        if (!this.connectedUsers.has(user_id)) {
          this.connectedUsers.set(user_id, new Set());
        }
        this.connectedUsers.get(user_id)!.add(socket.id);

        // Join user-specific room
        socket.join(`user:${user_id}`);
        
        // Join conversation-specific room if provided
        if (conversation_id) {
          socket.join(`conversation:${conversation_id}`);
        }

        socket.emit('authenticated', { user_id, conversation_id });
        logger.info(`User ${user_id} authenticated on socket ${socket.id}`);
      });

      // Handle joining specific conversations
      socket.on('join-conversation', (conversationId: number) => {
        if (!socket.data.user_id) {
          socket.emit('error', { message: 'Not authenticated' });
          return;
        }

        socket.join(`conversation:${conversationId}`);
        socket.data.conversation_id = conversationId;
        
        logger.info(`User ${socket.data.user_id} joined conversation ${conversationId}`);
        socket.emit('joined-conversation', { conversation_id: conversationId });
      });

      // Handle leaving conversations
      socket.on('leave-conversation', (conversationId: number) => {
        socket.leave(`conversation:${conversationId}`);
        
        if (socket.data.conversation_id === conversationId) {
          socket.data.conversation_id = undefined;
        }
        
        logger.info(`User ${socket.data.user_id} left conversation ${conversationId}`);
        socket.emit('left-conversation', { conversation_id: conversationId });
      });

      // Handle sending messages
      socket.on('send-message', async (data: {
        conversation_id: number;
        content: any;
        message_type?: string;
      }) => {
        if (!socket.data.user_id) {
          socket.emit('error', { message: 'Not authenticated' });
          return;
        }

        const message: ConversationMessage = {
          conversation_id: data.conversation_id,
          user_id: socket.data.user_id,
          message_type: (data.message_type as any) || 'user',
          content: data.content,
          timestamp: new Date(),
        };

        // Broadcast message to all users in the conversation
        this.broadcastToConversation(data.conversation_id, 'new-message', message);
        
        logger.info(`Message sent in conversation ${data.conversation_id} by user ${socket.data.user_id}`);
      });

      // Handle typing indicators
      socket.on('typing-start', (data: { conversation_id: number }) => {
        if (!socket.data.user_id) return;

        socket.to(`conversation:${data.conversation_id}`).emit('user-typing', {
          user_id: socket.data.user_id,
          conversation_id: data.conversation_id,
          typing: true,
        });
      });

      socket.on('typing-stop', (data: { conversation_id: number }) => {
        if (!socket.data.user_id) return;

        socket.to(`conversation:${data.conversation_id}`).emit('user-typing', {
          user_id: socket.data.user_id,
          conversation_id: data.conversation_id,
          typing: false,
        });
      });

      // Handle disconnect
      socket.on('disconnect', () => {
        const userId = socket.data.user_id;
        
        if (userId && this.connectedUsers.has(userId)) {
          this.connectedUsers.get(userId)!.delete(socket.id);
          
          // Remove user entry if no more connections
          if (this.connectedUsers.get(userId)!.size === 0) {
            this.connectedUsers.delete(userId);
          }
        }
        
        logger.info(`WebSocket client disconnected: ${socket.id}`);
      });
    });
  }

  // Public methods for broadcasting events
  static broadcastToUser(userId: string, event: string, data: any) {
    if (!this.io) return;
    
    this.io.to(`user:${userId}`).emit(event, data);
    logger.debug(`Broadcasted ${event} to user ${userId}`);
  }

  static broadcastToConversation(conversationId: number, event: string, data: any) {
    if (!this.io) return;
    
    this.io.to(`conversation:${conversationId}`).emit(event, data);
    logger.debug(`Broadcasted ${event} to conversation ${conversationId}`);
  }

  static sendConversationEvent(event: ConversationEvent) {
    if (!this.io) return;

    // Send to conversation room
    this.broadcastToConversation(event.conversation_id, 'conversation-event', event);
    
    // Also send to user's personal room
    this.broadcastToUser(event.user_id, 'conversation-event', event);
    
    logger.info(`Sent conversation event: ${event.type} for conversation ${event.conversation_id}`);
  }

  static sendMessage(message: ConversationMessage) {
    if (!this.io) return;

    this.broadcastToConversation(message.conversation_id, 'new-message', message);
    logger.info(`Sent message for conversation ${message.conversation_id}`);
  }

  static notifyStatusChange(conversationId: number, userId: string, oldStatus: number, newStatus: number) {
    const event: ConversationEvent = {
      type: 'status_change',
      conversation_id: conversationId,
      user_id: userId,
      data: { old_status: oldStatus, new_status: newStatus },
      timestamp: new Date(),
    };
    
    this.sendConversationEvent(event);
  }

  static notifyNodeChange(conversationId: number, userId: string, oldNodeId: number | null, newNodeId: number) {
    const event: ConversationEvent = {
      type: 'node_change',
      conversation_id: conversationId,
      user_id: userId,
      data: { old_node_id: oldNodeId, new_node_id: newNodeId },
      timestamp: new Date(),
    };
    
    this.sendConversationEvent(event);
  }

  static getConnectedUsers(): string[] {
    return Array.from(this.connectedUsers.keys());
  }

  static getUserConnectionCount(userId: string): number {
    return this.connectedUsers.get(userId)?.size || 0;
  }

  static isUserConnected(userId: string): boolean {
    return this.connectedUsers.has(userId) && this.connectedUsers.get(userId)!.size > 0;
  }
}