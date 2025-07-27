import dotenv from 'dotenv';
import { server } from './app-minimal';
import { syncDatabase } from './utils/database';
import logger from './utils/logger';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Graceful shutdown handler
const gracefulShutdown = (signal: string) => {
  logger.info(`${signal} signal received: closing HTTP server`);

  server.close(() => {
    logger.info('HTTP server closed.');
    process.exit(0);
  });

  // Force close after 10 seconds
  setTimeout(() => {
    logger.error(
      'Could not close connections in time, forcefully shutting down'
    );
    process.exit(1);
  }, 10000);
};

// Handle process signals for graceful shutdown
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', error => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start server
const startServer = async () => {
  try {
    // Sync database (create tables if they don't exist)
    await syncDatabase({ force: false });

    // Start HTTP server
    server.listen(PORT, () => {
      logger.info(`🚀 サーバーが起動しました`);
      logger.info(`🌍 環境: ${NODE_ENV}`);
      logger.info(`📡 ポート: ${PORT}`);
      logger.info(`🔗 URL: http://localhost:${PORT}`);
      logger.info(`❤️  Health Check: http://localhost:${PORT}/health`);
      logger.info(`📊 API: http://localhost:${PORT}/api/campaigns`);
    });
  } catch (error) {
    logger.error('サーバーの起動に失敗しました:', error);
    process.exit(1);
  }
};

// Start the server
startServer();