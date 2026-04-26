export class MessageInput {
  private element: HTMLElement;
  private textarea: HTMLTextAreaElement;

  constructor() {
    this.element = document.createElement('div');
    this.textarea = document.createElement('textarea');
    this.init();
  }

  private init() {
    this.element.className = 'scout-input-container';
    this.element.innerHTML = `
      <div class="scout-input-wrapper">
        <textarea id="msg-input" placeholder="Type your message..." rows="1"></textarea>
        <button id="send-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
          </svg>
        </button>
      </div>
    `;
    this.applyStyles();
    this.setupAutoResize();
  }

  private applyStyles() {
    this.element.setAttribute('style', `
      padding: 12px 16px;
      background: white;
      border-top: 1px solid #e5e7eb;
    `);

    const wrapper = this.element.querySelector('.scout-input-wrapper') as HTMLElement;
    wrapper.setAttribute('style', `
      display: flex;
      align-items: flex-end;
      gap: 8px;
      background: #f3f4f6;
      padding: 8px 12px;
      border-radius: 20px;
    `);

    const input = this.element.querySelector('#msg-input') as HTMLTextAreaElement;
    input.setAttribute('style', `
      flex: 1;
      background: transparent;
      border: none;
      outline: none;
      resize: none;
      font-family: inherit;
      font-size: 14px;
      max-height: 120px;
      padding: 4px 0;
    `);

    const btn = this.element.querySelector('#send-btn') as HTMLButtonElement;
    btn.setAttribute('style', `
      background: transparent;
      border: none;
      color: #3b82f6;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 4px;
      transition: transform 0.2s;
    `);
  }

  private setupAutoResize() {
    const input = this.element.querySelector('#msg-input') as HTMLTextAreaElement;
    input.addEventListener('input', () => {
      input.style.height = 'auto';
      input.style.height = input.scrollHeight + 'px';
    });
  }

  public getElement() {
    return this.element;
  }

  public getValue() {
    return (this.element.querySelector('#msg-input') as HTMLTextAreaElement).value.trim();
  }

  public clear() {
    const input = this.element.querySelector('#msg-input') as HTMLTextAreaElement;
    input.value = '';
    input.style.height = 'auto';
  }
}
