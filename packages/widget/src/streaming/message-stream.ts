export class MessageStream {
  private element: HTMLElement;
  private currentText: string = '';

  constructor(element: HTMLElement) {
    this.element = element;
  }

  public appendChunk(chunk: string) {
    this.currentText += chunk;
    this.render();
  }

  private render() {
    // In a real implementation, this would handle Markdown or complex formatting
    // For now, it updates the textContent directly
    this.element.textContent = this.currentText;
  }

  public finalize() {
    // Final cleanup or markdown rendering
  }

  public clear() {
    this.currentText = '';
    this.element.textContent = '';
  }
}
