import React, { useEffect } from 'react';

interface ScoutWidgetProps {
  clientId: string;
  baseUrl?: string;
}

export const ScoutWidget: React.FC<ScoutWidgetProps> = ({ 
  clientId, 
  baseUrl = 'https://api.scout.io' 
}) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.scout.io/widget.iife.js';
    script.async = true;
    script.setAttribute('data-client-id', clientId);
    script.setAttribute('data-base-url', baseUrl);
    
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
      // Clean up the widget root if needed
      const root = document.getElementById('scout-io-widget-root');
      if (root) root.remove();
    };
  }, [clientId, baseUrl]);

  return null; // The widget injects itself into the DOM
};
