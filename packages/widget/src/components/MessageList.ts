export class MessageList {
  private element: HTMLElement;

  constructor() {
    this.element = document.createElement('div');
    this.init();
  }

  private init() {
    this.element.className = 'scout-message-list';
    this.element.setAttribute('style', `
      flex: 1;
      padding: 16px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
      background: #f9fafb;
    `);
  }

  public getElement() {
    return this.element;
  }

  public addMessage(role: 'user' | 'assistant', content: string) {
    const msgWrapper = document.createElement('div');
    const isUser = role === 'user';
    
    msgWrapper.style.display = 'flex';
    msgWrapper.style.flexDirection = 'column';
    msgWrapper.style.alignItems = isUser ? 'flex-end' : 'flex-start';

    const msgBubble = document.createElement('div');
    msgBubble.setAttribute('style', `
      max-width: 85%;
      padding: 10px 14px;
      border-radius: 12px;
      font-size: 14px;
      line-height: 1.5;
      ${isUser ? 
        'background: #3b82f6; color: white; border-bottom-right-radius: 2px;' : 
        'background: white; color: #1f2937; border-bottom-left-radius: 2px; border: 1px solid #e5e7eb;'}
    `);
    
    msgBubble.textContent = content;
    msgWrapper.appendChild(msgBubble);
    
    this.element.appendChild(msgWrapper);
    this.scrollToBottom();
    return msgBubble;
  }

  private scrollToBottom() {
    this.element.scrollTop = this.element.scrollHeight;
  }
}
