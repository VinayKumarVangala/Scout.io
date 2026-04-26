import dotenv from 'dotenv';
import { createServer } from './server';

dotenv.config();

const { server, wss } = createServer();
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`
  🚀 Scout.io Backend Core
  -----------------------
  Port: ${PORT}
  Environment: ${process.env.NODE_ENV || 'development'}
  WebSocket: Active
  -----------------------
  `);
});

// Graceful Shutdown
const gracefulShutdown = async (signal: string) => {
  console.log(`\n[${signal}] Shutting down gracefully...`);

  // Close WebSocket server
  wss.clients.forEach((client) => {
    client.terminate();
  });
  
  wss.close(() => {
    console.log('[WS] WebSocket server closed');
  });

  // Close HTTP server
  server.close(() => {
    console.log('[HTTP] Server closed');
    
    // Close other connections (DB, Redis) here
    // Example: mongoose.connection.close()
    
    process.exit(0);
  });

  // Force exit if shutdown takes too long
  setTimeout(() => {
    console.error('[Shutdown] Forcefully exiting after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('unhandledRejection', (reason, promise) => {
  console.error('[UnhandledRejection]', reason);
});

process.on('uncaughtException', (error) => {
  console.error('[UncaughtException]', error);
  gracefulShutdown('UncaughtException');
});
