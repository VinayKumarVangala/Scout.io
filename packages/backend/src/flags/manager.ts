export class FeatureFlags {
  private static flags: Record<string, boolean> = {
    'streaming-enabled': true,
    'voice-support': false,
    'advanced-proxy': true,
    'analytics-v2': false,
  };

  public static isEnabled(flag: string): boolean {
    return this.flags[flag] || false;
  }

  public static setFlag(flag: string, value: boolean) {
    this.flags[flag] = value;
  }
}
