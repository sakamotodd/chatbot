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
import prizeRoutes from './api/in_instantwin_prizes';
import templateRoutes from './api/in_instantwin_templates';
import nodeRoutes from './api/in_instantwin_nodes';
import edgeRoutes from './api/in_instantwin_edges';
import flowRoutes from './api/flow';
import messageRoutes from './api/in_instantwin_messages';
import selectOptionRoutes from './api/in_instantwin_select_options';
import cardRoutes from './api/in_instantwin_cards';
import buttonRoutes from './api/in_instantwin_buttons';
import conversationRoutes from './api/in_instantwin_conversations';
import websocketRoutes from './api/websocket';
import lotteryRoutes from './api/lottery';

// Utils
import logger from './utils/logger';
import { WebSocketService } from './services/websocket_service';

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
app.use('/api', prizeRoutes);
app.use('/api', templateRoutes);
app.use('/api', nodeRoutes);
app.use('/api', edgeRoutes);
app.use('/api', flowRoutes);
app.use('/api', messageRoutes);
app.use('/api', selectOptionRoutes);
app.use('/api', cardRoutes);
app.use('/api', buttonRoutes);
app.use('/api', conversationRoutes);
app.use('/api', websocketRoutes);
app.use('/api', lotteryRoutes);

// Initialize WebSocket service
WebSocketService.initialize(io);

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

// Export app and server for testing and main entry point
export { app, server, io };
export default app;
