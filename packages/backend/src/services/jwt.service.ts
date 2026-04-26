import jwt from 'jsonwebtoken';
import { JWTPayload } from '@scout-io/shared';

export class JWTService {
  private secret: string;

  constructor() {
    this.secret = process.env.JWT_SECRET || 'fallback-secret-for-dev-only';
  }

  public generateToken(payload: JWTPayload, expiresIn: string = '24h'): string {
    return jwt.sign(payload, this.secret, { expiresIn });
  }

  public verifyToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, this.secret) as JWTPayload;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  public decodeToken(token: string): JWTPayload | null {
    return jwt.decode(token) as JWTPayload;
  }
}

export const jwtService = new JWTService();
