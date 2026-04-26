import { Router } from 'express';
import chatRoutes from './chat.routes';
import proxyRoutes from './proxy.routes';
import clientRoutes from './client.routes';
import providerRoutes from './provider.routes';
import analyticsRoutes from './analytics.routes';

const router = Router();

router.use('/chat', chatRoutes);
router.use('/proxy', proxyRoutes);
router.use('/clients', clientRoutes);
router.use('/providers', providerRoutes);
router.use('/analytics', analyticsRoutes);

export default router;
