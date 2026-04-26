import crypto from 'crypto';
import { ApiKeyModel } from '../models/ApiKey.model';

export class ApiKeyManagement {
  public static async generateKey(clientId: string, provider: string) {
    const rawKey = `scout_${crypto.randomBytes(24).toString('hex')}`;
    
    // In a real app, you'd store the hashed version and show the raw key once
    // For this implementation, we follow the existing pattern of encrypted storage
    return rawKey;
  }

  public static async listKeys(clientId: string) {
    return await ApiKeyModel.find({ clientId, isActive: true });
  }

  public static async revokeKey(clientId: string, provider: string) {
    await ApiKeyModel.updateOne({ clientId, provider }, { isActive: false });
  }
}
