export class DataMaskingService {
  private static piiPatterns = {
    email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    phone: /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,
    creditCard: /\b(?:\d{4}[ -]?){3}\d{4}\b/g,
    ssn: /\b\d{3}-\d{2}-\d{4}\b/g,
  };

  public static mask(content: string, rules: string[] = ['email', 'phone']): string {
    let maskedContent = content;

    rules.forEach(rule => {
      const pattern = (this.piiPatterns as any)[rule];
      if (pattern) {
        maskedContent = maskedContent.replace(pattern, (match: string) => {
          return `[REDACTED_${rule.toUpperCase()}]`;
        });
      }
    });

    return maskedContent;
  }
}
