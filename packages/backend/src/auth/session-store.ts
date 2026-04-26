import { redisManager } from '../cache/redis';

export class SessionStore {
  private prefix = 'session:';

  public async createSession(userId: string, data: any, ttl: number = 604800) {
    const redis = redisManager.getClient();
    const sessionId = `${this.prefix}${userId}:${Math.random().toString(36).substring(7)}`;
    
    await redis.set(sessionId, JSON.stringify(data), {
      EX: ttl
    });
    
    return sessionId;
  }

  public async revokeAllUserSessions(userId: string) {
    const redis = redisManager.getClient();
    const keys = await redis.keys(`${this.prefix}${userId}:*`);
    if (keys.length > 0) {
      await redis.del(keys);
    }
  }

  public async validateSession(sessionId: string): Promise<any | null> {
    const redis = redisManager.getClient();
    const data = await redis.get(sessionId);
    return data ? JSON.parse(data) : null;
  }
}

export const sessionStore = new SessionStore();
