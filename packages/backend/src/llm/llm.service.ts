import { LLMFactory } from './llm.factory';
import { LLMOptions, LLMResponse, StreamChunk } from './llm.interface';
import { Message, LLMProvider } from '@scout-io/shared';
import { apiKeyRepository } from '../repositories/apiKey.repository';

export class LLMService {
  public async invoke(
    clientId: string,
    provider: LLMProvider,
    messages: Message[],
    options: LLMOptions
  ): Promise<LLMResponse> {
    const apiKey = await apiKeyRepository.getKey(clientId, provider);
    if (!apiKey) {
      throw new Error(`API Key for ${provider} not found for client ${clientId}`);
    }

    const adapter = LLMFactory.createAdapter(provider, apiKey);
    return await adapter.invoke(messages, options);
  }

  public async *stream(
    clientId: string,
    provider: LLMProvider,
    messages: Message[],
    options: LLMOptions
  ): AsyncIterable<StreamChunk> {
    const apiKey = await apiKeyRepository.getKey(clientId, provider);
    if (!apiKey) {
      throw new Error(`API Key for ${provider} not found for client ${clientId}`);
    }

    const adapter = LLMFactory.createAdapter(provider, apiKey);
    yield* adapter.stream(messages, options);
  }
}

export const llmService = new LLMService();
