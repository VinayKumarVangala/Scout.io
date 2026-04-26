import { cacheService } from '../services/cache.service';

const SESSION_CACHE_PREFIX = 'session:';

export const sessionCache = {
  async setSession(sessionId: string, data: any, ttl: number = 3600): Promise<void> {
    await cacheService.set(`${SESSION_CACHE_PREFIX}${sessionId}`, data, ttl);
  },

  async getSession(sessionId: string): Promise<any | null> {
    return await cacheService.get(`${SESSION_CACHE_PREFIX}${sessionId}`);
  },

  async removeSession(sessionId: string): Promise<void> {
    await cacheService.del(`${SESSION_CACHE_PREFIX}${sessionId}`);
  }
};
