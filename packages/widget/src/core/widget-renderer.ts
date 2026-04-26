export class WidgetRenderer {
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  public renderLayout() {
    this.container.innerHTML = `
      <style>
        :host {
          --primary-color: #3b82f6;
          --bg-color: #ffffff;
          --text-color: #1f2937;
        }
        .scout-widget-container {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 9999;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        .scout-chat-window {
          width: 350px;
          height: 500px;
          background: var(--bg-color);
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          display: none;
          flex-direction: column;
          overflow: hidden;
          margin-bottom: 15px;
        }
        .scout-chat-header {
          padding: 15px;
          background: var(--primary-color);
          color: white;
          font-weight: bold;
        }
        .scout-messages-list {
          flex: 1;
          padding: 15px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .scout-message {
          max-width: 80%;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 14px;
        }
        .scout-message-user {
          align-self: flex-end;
          background: var(--primary-color);
          color: white;
        }
        .scout-message-bot {
          align-self: flex-start;
          background: #f3f4f6;
          color: var(--text-color);
        }
        .scout-input-area {
          padding: 15px;
          border-top: 1px solid #e5e7eb;
          display: flex;
          gap: 10px;
        }
        .scout-input {
          flex: 1;
          border: 1px solid #e5e7eb;
          padding: 8px;
          border-radius: 6px;
          outline: none;
        }
        .scout-button-toggle {
          width: 50px;
          height: 50px;
          border-radius: 25px;
          background: var(--primary-color);
          color: white;
          border: none;
          cursor: pointer;
          float: right;
          box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        }
      </style>
      <div class="scout-widget-container">
        <div class="scout-chat-window" id="chat-window">
          <div class="scout-chat-header">Scout Chat</div>
          <div class="scout-messages-list" id="messages-list"></div>
          <div class="scout-input-area">
            <input type="text" class="scout-input" id="chat-input" placeholder="Type a message...">
            <button id="send-button" style="background: none; border: none; cursor: pointer;">🚀</button>
          </div>
        </div>
        <button class="scout-button-toggle" id="toggle-button">💬</button>
      </div>
    `;
  }

  public addMessage(role: 'user' | 'bot', content: string) {
    const list = this.container.querySelector('#messages-list');
    if (!list) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = `scout-message scout-message-${role}`;
    msgDiv.textContent = content;
    list.appendChild(msgDiv);
    list.scrollTop = list.scrollHeight;
    return msgDiv;
  }

  public updateLastBotMessage(content: string) {
    const list = this.container.querySelector('#messages-list');
    const lastBotMsg = list?.querySelector('.scout-message-bot:last-child');
    if (lastBotMsg) {
      lastBotMsg.textContent += content;
      list!.scrollTop = list!.scrollHeight;
    }
  }
}
