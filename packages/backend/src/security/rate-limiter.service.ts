import { redisManager } from '../cache/redis';

export interface RateLimitConfig {
  points: number;
  duration: number; // in seconds
}

export class RateLimiterService {
  private redis = redisManager;

  public async isRateLimited(
    key: string,
    config: RateLimitConfig
  ): Promise<{ limited: boolean; remaining: number; reset: number }> {
    if (!this.redis.getStatus()) {
      return { limited: false, remaining: 1, reset: Date.now() + config.duration * 1000 };
    }

    const redisClient = this.redis.getClient();
    const fullKey = `ratelimit:${key}`;

    const multi = redisClient.multi();
    multi.incr(fullKey);
    multi.ttl(fullKey);

    const [current, ttl] = (await multi.exec()) as [number, number];

    if (current === 1 || ttl === -1) {
      await redisClient.expire(fullKey, config.duration);
    }

    const limited = current > config.points;
    const remaining = Math.max(0, config.points - current);
    const reset = Date.now() + (ttl > 0 ? ttl : config.duration) * 1000;

    return { limited, remaining, reset };
  }
}

export const rateLimiterService = new RateLimiterService();
