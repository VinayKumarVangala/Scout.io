import { Router } from 'express';
import { adminAuthMiddleware } from '../middleware/auth.middleware';
import { apiKeyRepository } from '../repositories/apiKey.repository';

const router = Router();

router.use(adminAuthMiddleware);

router.post('/configure', async (req, res, next) => {
  try {
    const { clientId, provider, key } = req.body;
    await apiKeyRepository.saveKey(clientId, provider, key);
    res.json({ message: `Provider ${provider} configured for client ${clientId}` });
  } catch (error) {
    next(error);
  }
});

router.post('/test', (req, res) => {
  res.json({ message: 'Provider test connection endpoint' });
});

export default router;
