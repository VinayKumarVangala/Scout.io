import axios from 'axios';
import { ILLMAdapter, LLMOptions, LLMResponse, StreamChunk } from '../llm.interface';
import { Message, LLMProvider } from '@scout-io/shared';

export class OpenAIAdapter implements ILLMAdapter {
  name: LLMProvider = 'openai';
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, baseUrl: string = 'https://api.openai.com/v1') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async invoke(messages: Message[], options: LLMOptions): Promise<LLMResponse> {
    const response = await axios.post(`${this.baseUrl}/chat/completions`, {
      model: options.model,
      messages,
      temperature: options.temperature,
      max_tokens: options.maxTokens,
      tools: options.tools,
    }, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      }
    });

    const choice = response.data.choices[0].message;
    return {
      content: choice.content || '',
      usage: {
        promptTokens: response.data.usage.prompt_tokens,
        completionTokens: response.data.usage.completion_tokens,
        totalTokens: response.data.usage.total_tokens,
      },
      toolCalls: choice.tool_calls,
    };
  }

  async *stream(messages: Message[], options: LLMOptions): AsyncIterable<StreamChunk> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: options.model,
        messages,
        temperature: options.temperature,
        stream: true,
      }),
    });

    if (!response.body) return;
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(line => line.trim() !== '');

      for (const line of lines) {
        const message = line.replace(/^data: /, '');
        if (message === '[DONE]') {
          yield { content: '', isDone: true };
          return;
        }

        try {
          const parsed = JSON.parse(message);
          const content = parsed.choices[0]?.delta?.content || '';
          if (content) {
            yield { content, isDone: false };
          }
        } catch (e) {
          // Skip partial JSON chunks
        }
      }
    }
  }
}
