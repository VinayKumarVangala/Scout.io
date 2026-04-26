export class PromptInjectionDetector {
  private static dangerousPatterns = [
    /ignore previous instructions/i,
    /system prompt/i,
    /disregard all/i,
    /new instructions/i,
    /you are now a/i,
    /secret key/i,
    /admin access/i,
  ];

  public static detect(content: string): { isInjected: boolean; pattern?: string } {
    for (const pattern of this.dangerousPatterns) {
      if (pattern.test(content)) {
        return { isInjected: true, pattern: pattern.toString() };
      }
    }
    return { isInjected: false };
  }

  public static sanitize(content: string): string {
    // Basic sanitization logic
    let sanitized = content;
    this.dangerousPatterns.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '[REDACTED_INJECTION_ATTEMPT]');
    });
    return sanitized;
  }
}
