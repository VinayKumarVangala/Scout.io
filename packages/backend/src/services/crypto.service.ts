import crypto from 'crypto';

export class CryptoService {
  private algorithm = 'aes-256-cbc';
  private key: Buffer;

  constructor() {
    const secret = process.env.ENCRYPTION_KEY;
    if (!secret || secret.length !== 32) {
      throw new Error('ENCRYPTION_KEY must be 32 characters long');
    }
    this.key = Buffer.from(secret);
  }

  public encrypt(text: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  }

  public decrypt(text: string): string {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift()!, 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }
}

export const cryptoService = new CryptoService();
