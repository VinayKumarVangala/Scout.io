import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/index.css';

interface WidgetConfig {
  elementId?: string;
  theme?: 'light' | 'dark';
  apiHost?: string;
}

/**
 * Initializes and mounts the Scout.io chat widget.
 * @param config Configuration options for the widget.
 * @returns An object with a destroy method to unmount the widget.
 */
export function init(config: WidgetConfig = {}) {
  const containerId = config.elementId || 'scout-chat-widget-root';
  let container = document.getElementById(containerId);

  if (!container) {
    container = document.createElement('div');
    container.id = containerId;
    document.body.appendChild(container);
  }

  const root = createRoot(container);
  
  root.render(
    React.createElement(React.StrictMode, null,
      React.createElement(App, { config })
    )
  );

  return {
    destroy: () => {
      root.unmount();
      if (container && !config.elementId) {
        container.remove();
      }
    }
  };
}
