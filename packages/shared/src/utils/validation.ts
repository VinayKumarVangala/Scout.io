import { z } from 'zod';

export const clientRegistrationSchema = z.object({
  name: z.string().min(2),
  domains: z.array(z.string().url()),
  settings: z.object({
    theme: z.object({
      primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i),
      secondaryColor: z.string().regex(/^#[0-9A-F]{6}$/i),
      logoUrl: z.string().url().optional(),
    }),
    llmConfig: z.object({
      provider: z.enum(['openai', 'gemini', 'ollama', 'groq', 'openrouter', 'huggingface']),
      model: z.string(),
      temperature: z.number().min(0).max(2).optional(),
      maxTokens: z.number().positive().optional(),
    }),
  }),
});

export const messageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string(),
  timestamp: z.number(),
});

export const proxyRequestSchema = z.object({
  url: z.string().url(),
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE']),
  headers: z.record(z.string()).optional(),
  body: z.any().optional(),
});

export const llmConfigSchema = z.object({
  provider: z.enum(['openai', 'gemini', 'ollama', 'groq', 'openrouter', 'huggingface']),
  model: z.string(),
  temperature: z.number().optional(),
  maxTokens: z.number().optional(),
});
