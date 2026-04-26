import { createClient, RedisClientType } from 'redis';

export class RedisManager {
  private static instance: RedisManager;
  private client: RedisClientType;
  private isConnected: boolean = false;

  private constructor() {
    const url = process.env.REDIS_URL;
    if (!url) {
      throw new Error('REDIS_URL is not defined');
    }

    this.client = createClient({
      url,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            console.error('Redis reconnection failed after 10 attempts');
            return new Error('Redis reconnection failed');
          }
          return Math.min(retries * 100, 3000);
        },
      },
    });

    this.client.on('error', (err) => console.error('Redis Client Error', err));
    this.client.on('connect', () => console.log('🔴 Redis connecting...'));
    this.client.on('ready', () => {
      console.log('🔴 Redis Client Ready');
      this.isConnected = true;
    });
    this.client.on('end', () => {
      console.warn('Redis connection closed');
      this.isConnected = false;
    });
  }

  public static getInstance(): RedisManager {
    if (!RedisManager.instance) {
      RedisManager.instance = new RedisManager();
    }
    return RedisManager.instance;
  }

  public async connect(): Promise<void> {
    if (this.isConnected) return;
    await this.client.connect();
  }

  public getClient(): RedisClientType {
    return this.client;
  }

  public getStatus(): boolean {
    return this.isConnected;
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnected) return;
    await this.client.quit();
    this.isConnected = false;
  }
}

export const redisManager = RedisManager.getInstance();
