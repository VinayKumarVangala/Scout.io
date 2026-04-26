import { cacheService } from '../services/cache.service';
import { Client } from '@scout-io/shared';

const CLIENT_CACHE_PREFIX = 'client:';

export const clientCache = {
  async get(clientId: string): Promise<Client | null> {
    return await cacheService.get<Client>(`${CLIENT_CACHE_PREFIX}${clientId}`);
  },

  async set(clientId: string, config: Client): Promise<void> {
    await cacheService.set(`${CLIENT_CACHE_PREFIX}${clientId}`, config, 3600); // 1 hour
  },

  async invalidate(clientId: string): Promise<void> {
    await cacheService.del(`${CLIENT_CACHE_PREFIX}${clientId}`);
  }
};
