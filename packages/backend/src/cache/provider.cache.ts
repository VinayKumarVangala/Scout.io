import { cacheService } from '../services/cache.service';

const PROVIDER_STATUS_PREFIX = 'provider:status:';

export const providerCache = {
  async setStatus(provider: string, isAvailable: boolean): Promise<void> {
    await cacheService.set(`${PROVIDER_STATUS_PREFIX}${provider}`, { isAvailable, lastChecked: Date.now() }, 300); // 5 mins
  },

  async getStatus(provider: string): Promise<{ isAvailable: boolean; lastChecked: number } | null> {
    return await cacheService.get(`${PROVIDER_STATUS_PREFIX}${provider}`);
  }
};
