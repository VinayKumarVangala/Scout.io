export class RequestSanitizer {
  private static forbiddenHeaders = [
    'host',
    'connection',
    'content-length',
    'transfer-encoding',
    'cookie',
    'authorization',
  ];

  public static sanitizeHeaders(headers: Record<string, string>): Record<string, string> {
    const sanitized: Record<string, string> = {};
    for (const [key, value] of Object.entries(headers)) {
      if (!this.forbiddenHeaders.includes(key.toLowerCase())) {
        sanitized[key] = value;
      }
    }
    return sanitized;
  }

  public static sanitizeUrl(url: string): string {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new Error('Invalid protocol');
    }
    return url;
  }
}
