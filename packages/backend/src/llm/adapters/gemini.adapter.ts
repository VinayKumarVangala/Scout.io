import axios from 'axios';
import { ILLMAdapter, LLMOptions, LLMResponse, StreamChunk } from '../llm.interface';
import { Message, LLMProvider } from '@scout-io/shared';

export class GeminiAdapter implements ILLMAdapter {
  name: LLMProvider = 'gemini';
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async invoke(messages: Message[], options: LLMOptions): Promise<LLMResponse> {
    const contents = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${options.model}:generateContent?key=${this.apiKey}`,
      { contents },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const candidate = response.data.candidates[0].content;
    return {
      content: candidate.parts[0].text || '',
      usage: {
        promptTokens: 0, // Gemini API usage details vary by version
        completionTokens: 0,
        totalTokens: 0,
      },
    };
  }

  async *stream(messages: Message[], options: LLMOptions): AsyncIterable<StreamChunk> {
    // Basic implementation for Gemini streaming
    const contents = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${options.model}:streamGenerateContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents }),
      }
    );

    if (!response.body) return;
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      try {
        const parsed = JSON.parse(chunk);
        const content = parsed[0]?.candidates[0]?.content?.parts[0]?.text || '';
        if (content) yield { content, isDone: false };
      } catch (e) {
        // Handle streaming JSON parsing
      }
    }
    yield { content: '', isDone: true };
  }
}
