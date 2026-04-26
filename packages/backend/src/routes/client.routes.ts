import { Router } from 'express';
import { adminAuthMiddleware } from '../middleware/auth.middleware';
import { clientRepository } from '../repositories/client.repository';
import { ClientModel } from '../models/Client.model';

const router = Router();

router.use(adminAuthMiddleware);

router.post('/', async (req, res, next) => {
  try {
    const client = await clientRepository.create(req.body);
    res.status(201).json(client);
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const clients = await ClientModel.find();
    res.json(clients);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const client = await clientRepository.findById(req.params.id);
    if (!client) return res.status(404).json({ message: 'Not found' });
    res.json(client);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const client = await clientRepository.update(req.params.id, req.body);
    res.json(client);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await clientRepository.delete(req.params.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

export default router;
