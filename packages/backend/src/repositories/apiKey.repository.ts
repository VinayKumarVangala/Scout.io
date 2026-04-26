import { ApiKeyModel, ApiKeyDocument } from '../models/ApiKey.model';
import { cryptoService } from '../services/crypto.service';

export class ApiKeyRepository {
  async saveKey(clientId: string, provider: string, rawKey: string): Promise<ApiKeyDocument> {
    const encryptedKey = cryptoService.encrypt(rawKey);
    return await ApiKeyModel.findOneAndUpdate(
      { clientId, provider },
      { key: encryptedKey, isActive: true },
      { upsert: true, new: true }
    );
  }

  async getKey(clientId: string, provider: string): Promise<string | null> {
    const record = await ApiKeyModel.findOne({ clientId, provider, isActive: true });
    if (!record) return null;
    return cryptoService.decrypt(record.key);
  }

  async deactivateKey(clientId: string, provider: string): Promise<void> {
    await ApiKeyModel.updateOne({ clientId, provider }, { isActive: false });
  }
}

export const apiKeyRepository = new ApiKeyRepository();
