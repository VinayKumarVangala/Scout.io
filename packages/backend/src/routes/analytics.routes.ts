import { Router } from 'express';
import { adminAuthMiddleware } from '../middleware/auth.middleware';
import { usageRepository } from '../repositories/usage.repository';

const router = Router();

router.use(adminAuthMiddleware);

router.get('/usage', async (req, res, next) => {
  try {
    const { clientId, start, end } = req.query;
    const usage = await usageRepository.getClientUsage(
      clientId as string,
      new Date(start as string),
      new Date(end as string)
    );
    res.json(usage);
  } catch (error) {
    next(error);
  }
});

export default router;
