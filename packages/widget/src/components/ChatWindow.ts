export class ChatWindow {
  private element: HTMLElement;

  constructor() {
    this.element = document.createElement('div');
    this.init();
  }

  private init() {
    this.element.className = 'scout-chat-window';
    this.element.innerHTML = `
      <div class="scout-window-header" id="window-header">
        <span class="scout-header-title">Scout.io</span>
        <div class="scout-header-actions">
          <button id="minimize-btn">−</button>
          <button id="fullscreen-btn">⛶</button>
        </div>
      </div>
      <div class="scout-window-content" id="window-content"></div>
    `;
    this.applyStyles();
  }

  private applyStyles() {
    this.element.setAttribute('style', `
      position: fixed;
      bottom: 90px;
      right: 20px;
      width: 380px;
      height: 600px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 12px 32px rgba(0,0,0,0.12);
      display: none;
      flex-direction: column;
      overflow: hidden;
      z-index: 9999;
      transition: opacity 0.2s ease, transform 0.2s ease;
      border: 1px solid #e5e7eb;
    `);

    const header = this.element.querySelector('#window-header') as HTMLElement;
    header.setAttribute('style', `
      padding: 12px 16px;
      background: #3b82f6;
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: move;
      user-select: none;
    `);
  }

  public getElement() {
    return this.element;
  }

  public getContentArea() {
    return this.element.querySelector('#window-content') as HTMLElement;
  }

  public toggle(show: boolean) {
    this.element.style.display = show ? 'flex' : 'none';
    if (show) {
      this.element.animate([
        { opacity: 0, transform: 'translateY(10px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ], { duration: 200 });
    }
  }
}
