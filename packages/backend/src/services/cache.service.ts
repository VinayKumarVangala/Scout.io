import { redisManager } from '../cache/redis';

export class CacheService {
  private memoryCache: Map<string, { value: any; expiry: number }> = new Map();

  public async get<T>(key: string): Promise<T | null> {
    try {
      if (redisManager.getStatus()) {
        const value = await redisManager.getClient().get(key);
        return value ? JSON.parse(value) : null;
      }
    } catch (error) {
      console.warn(`Redis GET failed for key ${key}, falling back to memory`, error);
    }

    // Memory Fallback
    const cached = this.memoryCache.get(key);
    if (cached && cached.expiry > Date.now()) {
      return cached.value as T;
    }
    if (cached) this.memoryCache.delete(key);
    return null;
  }

  public async set(key: string, value: any, ttlSeconds: number = 3600): Promise<void> {
    const stringValue = JSON.stringify(value);
    
    try {
      if (redisManager.getStatus()) {
        await redisManager.getClient().set(key, stringValue, {
          EX: ttlSeconds,
        });
      }
    } catch (error) {
      console.warn(`Redis SET failed for key ${key}, using memory cache`, error);
    }

    // Update Memory Cache as well (Double-caching for reliability)
    this.memoryCache.set(key, {
      value,
      expiry: Date.now() + ttlSeconds * 1000,
    });
  }

  public async del(key: string): Promise<void> {
    try {
      if (redisManager.getStatus()) {
        await redisManager.getClient().del(key);
      }
    } catch (error) {
      console.warn(`Redis DEL failed for key ${key}`, error);
    }
    this.memoryCache.delete(key);
  }

  public async flushAll(): Promise<void> {
    if (redisManager.getStatus()) {
      await redisManager.getClient().flushAll();
    }
    this.memoryCache.clear();
  }
}

export const cacheService = new CacheService();
