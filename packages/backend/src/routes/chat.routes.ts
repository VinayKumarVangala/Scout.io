import { Router } from 'express';
import { tenantMiddleware } from '../middleware/tenant.middleware';
import { authMiddleware } from '../middleware/auth.middleware';
import { llmService } from '../llm/llm.service';
import { conversationRepository } from '../repositories/conversation.repository';

const router = Router();

router.use(tenantMiddleware);

router.post('/completions', authMiddleware, async (req: any, res, next) => {
  try {
    const { messages, options } = req.body;
    const response = await llmService.invoke(
      req.tenant._id.toString(),
      req.tenant.settings.llmConfig.provider,
      messages,
      { ...req.tenant.settings.llmConfig, ...options }
    );

    // Save history
    const userId = req.body.userId || 'anonymous';
    await conversationRepository.addMessage(req.tenant._id.toString(), userId, messages[messages.length - 1]);
    await conversationRepository.addMessage(req.tenant._id.toString(), userId, {
      role: 'assistant',
      content: response.content,
      timestamp: Date.now()
    });

    res.json(response);
  } catch (error) {
    next(error);
  }
});

router.post('/stream', authMiddleware, async (req: any, res, next) => {
  try {
    const { messages, options } = req.body;
    const stream = llmService.stream(
      req.tenant._id.toString(),
      req.tenant.settings.llmConfig.provider,
      messages,
      { ...req.tenant.settings.llmConfig, ...options }
    );

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    for await (const chunk of stream) {
      res.write(`data: ${JSON.stringify(chunk)}\n\n`);
    }
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    next(error);
  }
});

router.get('/history', authMiddleware, async (req: any, res, next) => {
  try {
    const { userId, limit, offset } = req.query;
    const history = await conversationRepository.getHistory(
      req.tenant._id.toString(),
      userId as string,
      Number(limit),
      Number(offset)
    );
    res.json(history);
  } catch (error) {
    next(error);
  }
});

export default router;
