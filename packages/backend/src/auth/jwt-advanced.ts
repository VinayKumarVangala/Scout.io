import jwt from 'jsonwebtoken';
import { cryptoService } from '../services/crypto.service';

export class JWTAdvancedService {
  private secret: string;
  private refreshSecret: string;

  constructor() {
    this.secret = process.env.JWT_SECRET || 'secret';
    this.refreshSecret = process.env.JWT_REFRESH_SECRET || 'refresh-secret';
  }

  public generateTokens(payload: any) {
    const accessToken = jwt.sign(payload, this.secret, { expiresIn: '15m' });
    const refreshToken = jwt.sign(payload, this.refreshSecret, { expiresIn: '7d' });
    
    return {
      accessToken,
      refreshToken,
      expiresIn: 900 // 15 mins
    };
  }

  public verifyRefreshToken(token: string): any {
    return jwt.verify(token, this.refreshSecret);
  }

  public generateDeviceFingerprint(req: any): string {
    const data = `${req.ip}-${req.headers['user-agent']}`;
    return cryptoService.encrypt(data).split(':')[1].substring(0, 32);
  }
}

export const jwtAdvancedService = new JWTAdvancedService();
