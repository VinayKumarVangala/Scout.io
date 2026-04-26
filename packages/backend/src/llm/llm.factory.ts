import { OpenAIAdapter } from './adapters/openai.adapter';
import { GeminiAdapter } from './adapters/gemini.adapter';
import { ILLMAdapter } from './llm.interface';
import { LLMProvider } from '@scout-io/shared';

export class LLMFactory {
  public static createAdapter(provider: LLMProvider, apiKey: string): ILLMAdapter {
    switch (provider) {
      case 'openai':
        return new OpenAIAdapter(apiKey);
      case 'gemini':
        return new GeminiAdapter(apiKey);
      case 'groq':
        return new OpenAIAdapter(apiKey, 'https://api.groq.com/openai/v1');
      case 'openrouter':
        return new OpenAIAdapter(apiKey, 'https://openrouter.ai/api/v1');
      case 'ollama':
        return new OpenAIAdapter(apiKey, 'http://localhost:11434/v1');
      case 'huggingface':
        // Placeholder for HuggingFace
        throw new Error('HuggingFace adapter not fully implemented');
      default:
        throw new Error(`Unsupported LLM provider: ${provider}`);
    }
  }
}
