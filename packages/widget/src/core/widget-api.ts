export interface WidgetConfig {
  clientId: string;
  baseUrl: string;
  userId?: string;
}

export class WidgetAPI {
  private config: WidgetConfig;
  private token: string | null = null;

  constructor(config: WidgetConfig) {
    this.config = config;
  }

  public async fetchToken(): Promise<string> {
    // In a real scenario, this would call a secure handshake endpoint
    // For PoC, we might receive it via data-attributes or a simple auth call
    return 'mock-token';
  }

  public async sendMessage(content: string, messages: any[]) {
    const response = await fetch(`${this.config.baseUrl}/api/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': this.config.clientId,
        'Authorization': `Bearer ${this.token || await this.fetchToken()}`,
      },
      body: JSON.stringify({
        messages: [...messages, { role: 'user', content, timestamp: Date.now() }],
        userId: this.config.userId || 'anonymous',
      }),
    });

    if (!response.ok) throw new Error('Failed to send message');
    return await response.json();
  }

  public async *streamMessage(content: string, messages: any[]) {
    const response = await fetch(`${this.config.baseUrl}/api/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': this.config.clientId,
        'Authorization': `Bearer ${this.token || await this.fetchToken()}`,
      },
      body: JSON.stringify({
        messages: [...messages, { role: 'user', content, timestamp: Date.now() }],
        userId: this.config.userId || 'anonymous',
      }),
    });

    if (!response.body) return;
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') return;
          try {
            yield JSON.parse(data);
          } catch (e) {}
        }
      }
    }
  }
}
