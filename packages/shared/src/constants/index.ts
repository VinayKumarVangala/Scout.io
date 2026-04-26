import { LLMProvider } from '../types';

export const SUPPORTED_PROVIDERS: LLMProvider[] = [
  'openai',
  'gemini',
  'ollama',
  'groq',
  'openrouter',
  'huggingface'
];

export const DEFAULT_MODELS: Record<LLMProvider, string> = {
  openai: 'gpt-4o',
  gemini: 'gemini-1.5-pro',
  ollama: 'llama3',
  groq: 'llama3-70b-8192',
  openrouter: 'openai/gpt-3.5-turbo',
  huggingface: 'mistralai/Mistral-7B-v0.1'
};

export const ERROR_CODES = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  LLM_PROVIDER_ERROR: 'LLM_PROVIDER_ERROR',
  PROXY_ERROR: 'PROXY_ERROR',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR'
} as const;
