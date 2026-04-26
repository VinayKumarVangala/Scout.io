export class WebSocketClient {
  private socket: WebSocket | null = null;
  private url: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  constructor(url: string) {
    this.url = url;
  }

  public connect() {
    this.socket = new WebSocket(this.url);

    this.socket.onopen = () => {
      console.log('WS Connected');
      this.reconnectAttempts = 0;
      this.startHeartbeat();
    };

    this.socket.onclose = () => {
      console.warn('WS Closed');
      this.handleReconnect();
    };

    this.socket.onerror = (err) => {
      console.error('WS Error:', err);
    };

    this.socket.onmessage = (event) => {
      // Handle incoming WS messages
    };
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.pow(2, this.reconnectAttempts) * 1000;
      setTimeout(() => this.connect(), delay);
    }
  }

  private startHeartbeat() {
    setInterval(() => {
      if (this.socket?.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000);
  }

  public send(data: any) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    }
  }
}
