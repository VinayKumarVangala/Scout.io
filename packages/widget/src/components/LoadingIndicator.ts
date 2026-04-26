export class LoadingIndicator {
  private element: HTMLElement;

  constructor() {
    this.element = document.createElement('div');
    this.init();
  }

  private init() {
    this.element.className = 'scout-loading';
    this.element.innerHTML = `
      <div class="scout-dot-flashing"></div>
    `;
    this.applyStyles();
  }

  private applyStyles() {
    this.element.setAttribute('style', `
      display: none;
      padding: 8px 12px;
      background: #f3f4f6;
      border-radius: 12px;
      width: fit-content;
      margin: 8px 0;
    `);

    // Dynamic style for animation
    const style = document.createElement('style');
    style.textContent = `
      .scout-dot-flashing {
        position: relative;
        width: 8px;
        height: 8px;
        border-radius: 5px;
        background-color: #9ca3af;
        color: #9ca3af;
        animation: scout-dot-flashing 1s infinite linear alternate;
        animation-delay: 0.5s;
        margin: 0 15px;
      }
      .scout-dot-flashing::before, .scout-dot-flashing::after {
        content: "";
        display: inline-block;
        position: absolute;
        top: 0;
      }
      .scout-dot-flashing::before {
        left: -15px;
        width: 8px;
        height: 8px;
        border-radius: 5px;
        background-color: #9ca3af;
        color: #9ca3af;
        animation: scout-dot-flashing 1s infinite alternate;
        animation-delay: 0s;
      }
      .scout-dot-flashing::after {
        left: 15px;
        width: 8px;
        height: 8px;
        border-radius: 5px;
        background-color: #9ca3af;
        color: #9ca3af;
        animation: scout-dot-flashing 1s infinite alternate;
        animation-delay: 1s;
      }
      @keyframes scout-dot-flashing {
        0% { background-color: #9ca3af; }
        50%, 100% { background-color: #e5e7eb; }
      }
    `;
    document.head.appendChild(style);
  }

  public getElement() {
    return this.element;
  }

  public toggle(show: boolean) {
    this.element.style.display = show ? 'block' : 'none';
  }
}
