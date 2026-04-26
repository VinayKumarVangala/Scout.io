import { Router } from 'express';
import { tenantMiddleware } from '../middleware/tenant.middleware';
import { authMiddleware } from '../middleware/auth.middleware';
import { proxyEngine } from '../proxy/proxy.engine';

const router = Router();

router.use(tenantMiddleware);
router.use(authMiddleware);

router.post('/execute', async (req: any, res, next) => {
  try {
    const response = await proxyEngine.handleRequest(
      req.tenant._id.toString(),
      req.body
    );
    res.status(response.status).json(response);
  } catch (error) {
    next(error);
  }
});

router.get('/status', (req, res) => {
  res.json({ status: 'active', proxy: 'healthy' });
});

export default router;
