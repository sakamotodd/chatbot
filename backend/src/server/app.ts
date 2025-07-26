import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Middleware imports
import { loggingMiddleware } from './middleware/logging_middleware';
import { errorHandler, notFoundHandler } from './middleware/error_middleware';

// Router imports
import campaignRoutes from './api/campaigns';
// import prizeRoutes from './api/in_instantwin_prizes';
// import templateRoutes from './api/in_instantwin_templates';
// import conversationRoutes from './api/in_instantwin_conversations';
// import nodeRoutes from './api/in_instantwin_nodes';
// import messageRoutes from './api/in_instantwin_messages';
// import flowRoutes from './api/flow';

// Utils
import logger from './utils/logger';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message:
      'リクエスト回数が制限を超えました。しばらく待ってから再試行してください。',
  },
});

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Basic middleware
app.use(compression() as any);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Apply rate limiting to all requests
app.use(limiter);

// Logging middleware
app.use(loggingMiddleware);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'サーバーは正常に動作しています',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// API routes
app.use('/api', (req, res, next) => {
  res.header('Content-Type', 'application/json; charset=utf-8');
  next();
});

// API route handlers
app.use('/api/campaigns', campaignRoutes);
// app.use('/api/prizes', prizeRoutes);
// app.use('/api/templates', templateRoutes);
// app.use('/api/conversations', conversationRoutes);
// app.use('/api/nodes', nodeRoutes);
// app.use('/api/messages', messageRoutes);
// app.use('/api/flow', flowRoutes);

// WebSocket connection handling
io.on('connection', socket => {
  logger.info(`WebSocket client connected: ${socket.id}`);

  socket.on('join-conversation', (conversationId: string) => {
    socket.join(`conversation-${conversationId}`);
    logger.info(`Client ${socket.id} joined conversation ${conversationId}`);
  });

  socket.on('leave-conversation', (conversationId: string) => {
    socket.leave(`conversation-${conversationId}`);
    logger.info(`Client ${socket.id} left conversation ${conversationId}`);
  });

  socket.on('disconnect', () => {
    logger.info(`WebSocket client disconnected: ${socket.id}`);
  });
});

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

// Export app and server for testing and main entry point
export { app, server, io };
export default app;
