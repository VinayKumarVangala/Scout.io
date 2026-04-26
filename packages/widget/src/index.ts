import { WidgetCore } from './core/widget-core';

(function() {
  const script = document.currentScript as HTMLScriptElement;
  if (!script) return;

  const clientId = script.getAttribute('data-client-id');
  const baseUrl = script.getAttribute('data-base-url') || 'http://localhost:5000';

  if (!clientId) {
    console.error('Scout.io Widget: data-client-id is required');
    return;
  }

  const container = document.createElement('div');
  container.id = 'scout-io-widget-root';
  document.body.appendChild(container);

  new WidgetCore({ clientId, baseUrl }, container);
  
  console.log('🚀 Scout.io Widget initialized');
})();
