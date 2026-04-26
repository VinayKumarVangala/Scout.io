import { Message, LLMProvider as ProviderName } from '@scout-io/shared';

export interface LLMOptions {
  model: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  tools?: any[];
}

export interface StreamChunk {
  content: string;
  isDone: boolean;
  metadata?: any;
}

export interface LLMResponse {
  content: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  toolCalls?: any[];
}

export interface ILLMAdapter {
  name: ProviderName;
  invoke(messages: Message[], options: LLMOptions): Promise<LLMResponse>;
  stream(messages: Message[], options: LLMOptions): AsyncIterable<StreamChunk>;
}
