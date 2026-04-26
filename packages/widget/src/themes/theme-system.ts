export interface WidgetTheme {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  border: string;
  radius: string;
}

export class ThemeSystem {
  public static applyTheme(container: HTMLElement, theme: WidgetTheme) {
    const style = container.style;
    style.setProperty('--scout-primary', theme.primary);
    style.setProperty('--scout-secondary', theme.secondary);
    style.setProperty('--scout-bg', theme.background);
    style.setProperty('--scout-surface', theme.surface);
    style.setProperty('--scout-text', theme.text);
    style.setProperty('--scout-text-muted', theme.textMuted);
    style.setProperty('--scout-border', theme.border);
    style.setProperty('--scout-radius', theme.radius);
  }
}
