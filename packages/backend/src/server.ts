import express from 'express';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';
import { requestLogger } from './middleware/requestLogger';
import { globalRateLimiter } from './middleware/rateLimiter';
import apiRouter from './routes/api.routes';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

export function createServer() {
  const app = express();
  const server = http.createServer(app);
  const wss = new WebSocketServer({ server });

  // Security & Optimization Middleware
  app.use(helmet());
  app.use(compression());
  app.use(requestLogger);
  app.use(morgan('dev'));
  
  // CORS Configuration
  const whitelist = process.env.ALLOWED_DOMAINS?.split(',') || [];
  app.use(cors({
    origin: (origin, callback) => {
      if (!origin || whitelist.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  }));

  // Body Parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Global Rate Limiter
  app.use(globalRateLimiter);

  // API Routes
  app.use('/api', apiRouter);

  // Documentation
  const swaggerDocument = YAML.load(path.join(__dirname, 'docs/swagger.yaml'));
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  // Health Checks
  app.get('/health', (req, res) => {
    res.json({
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  });

  app.get('/health/detailed', async (req, res) => {
    // Placeholder for DB check
    const dbStatus = 'connected'; // This will be dynamic once mongoose is set up
    res.json({
      status: 'ok',
      services: {
        database: dbStatus,
        redis: 'connected', // Placeholder
      },
    });
  });

  // WebSocket Connection Handling
  wss.on('connection', (ws: WebSocket, req: http.IncomingMessage) => {
    console.log(`[WS] New connection from ${req.socket.remoteAddress}`);

    ws.on('message', (message: string) => {
      console.log(`[WS] Received: ${message}`);
      // Simple echo for now
      ws.send(`Echo: ${message}`);
    });

    ws.on('close', () => {
      console.log('[WS] Connection closed');
    });

    ws.on('error', (error) => {
      console.error(`[WS] Error: ${error.message}`);
    });
  });

  // Error Handling (Must be last)
  app.use(notFound);
  app.use(errorHandler);

  return { app, server, wss };
}
