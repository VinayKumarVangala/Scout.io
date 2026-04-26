export class WidgetButton {
  private element: HTMLButtonElement;
  private position: 'bottom-right' | 'bottom-left';

  constructor(position: 'bottom-right' | 'bottom-left' = 'bottom-right') {
    this.position = position;
    this.element = document.createElement('button');
    this.init();
  }

  private init() {
    this.element.className = 'scout-fab';
    this.element.innerHTML = `
      <span class="scout-icon">💬</span>
      <span class="scout-badge" id="unread-badge" style="display: none;">0</span>
    `;
    this.applyStyles();
  }

  private applyStyles() {
    const posStyle = this.position === 'bottom-right' ? 'right: 20px;' : 'left: 20px;';
    this.element.setAttribute('style', `
      position: fixed;
      bottom: 20px;
      ${posStyle}
      width: 56px;
      height: 56px;
      border-radius: 28px;
      background: #3b82f6;
      color: white;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      z-index: 10000;
    `);
  }

  public getElement() {
    return this.element;
  }

  public setBadge(count: number) {
    const badge = this.element.querySelector('#unread-badge') as HTMLElement;
    if (count > 0) {
      badge.textContent = count > 9 ? '9+' : count.toString();
      badge.style.display = 'flex';
    } else {
      badge.style.display = 'none';
    }
  }

  public pulse() {
    this.element.animate([
      { transform: 'scale(1)' },
      { transform: 'scale(1.1)' },
      { transform: 'scale(1)' }
    ], {
      duration: 500,
      iterations: 2
    });
  }
}
