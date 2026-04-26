import { WidgetRenderer } from './widget-renderer';
import { WidgetAPI, WidgetConfig } from './widget-api';

export class WidgetCore {
  private renderer: WidgetRenderer;
  private api: WidgetAPI;
  private isOpen: boolean = false;
  private messages: any[] = [];

  constructor(config: WidgetConfig, host: HTMLElement) {
    const shadow = host.attachShadow({ mode: 'open' });
    this.renderer = new WidgetRenderer(shadow as unknown as HTMLElement);
    this.api = new WidgetAPI(config);
    this.init();
  }

  private init() {
    this.renderer.renderLayout();
    this.bindEvents();
  }

  private bindEvents() {
    const shadow = (this.renderer as any).container;
    const toggleBtn = shadow.querySelector('#toggle-button');
    const chatWindow = shadow.querySelector('#chat-window');
    const sendBtn = shadow.querySelector('#send-button');
    const input = shadow.querySelector('#chat-input') as HTMLInputElement;

    toggleBtn.addEventListener('click', () => {
      this.isOpen = !this.isOpen;
      chatWindow.style.display = this.isOpen ? 'flex' : 'none';
    });

    const handleSend = async () => {
      const content = input.value.trim();
      if (!content) return;

      input.value = '';
      this.renderer.addMessage('user', content);
      this.messages.push({ role: 'user', content });

      // Start bot message for streaming
      this.renderer.addMessage('bot', '');
      
      try {
        const stream = this.api.streamMessage(content, this.messages);
        let fullResponse = '';
        
        for await (const chunk of stream) {
          if (chunk.content) {
            this.renderer.updateLastBotMessage(chunk.content);
            fullResponse += chunk.content;
          }
        }
        
        this.messages.push({ role: 'assistant', content: fullResponse });
      } catch (error) {
        console.error('Widget Error:', error);
        this.renderer.updateLastBotMessage('Error: Failed to connect to backend.');
      }
    };

    sendBtn.addEventListener('click', handleSend);
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleSend();
    });
  }
}
