import { createClient, RedisClientType } from "redis";
import { environmentVariables } from "../../main/config/environmentVariables";

export class CacheDbAdapter {
  private static instance: CacheDbAdapter;
  private client: RedisClientType;
  private isConnected: boolean = false;

  private constructor() {
    this.client = createClient({
      password: environmentVariables.REDIS_PASSWORD,
      socket: {
        host: environmentVariables.REDIS_HOST,
        port: environmentVariables.REDIS_PORT,
      },
    });

    this.setupEventListeners();
  }

  public static getInstance(): CacheDbAdapter {
    if (!CacheDbAdapter.instance) {
      CacheDbAdapter.instance = new CacheDbAdapter();
    }
    return CacheDbAdapter.instance;
  }

  private setupEventListeners(): void {
    this.client.on("connect", () => {
      console.log("=> Redis connected");
      this.isConnected = true;
    });

    this.client.on("error", (error) => {
      console.error("=> Redis error:\n", error);
      this.isConnected = false;
    });

    this.client.on("end", () => {
      console.log("=> Redis finished");
      this.isConnected = false;
    });

    this.client.on("reconnecting", () => {
      console.log("=> Reconnecting Redis");
    });
  }

  public async connect(): Promise<void> {
    if (!this.isConnected) {
      try {
        await this.client.connect();
      } catch (error) {
        console.error("❌ Falha ao conectar com Redis:", error);
        throw error;
      }
    }
  }

  private async ensureConnection(): Promise<void> {
    if (!this.isConnected) {
      await this.connect();
    }
  }

  public async get(key: string): Promise<string | null> {
    await this.ensureConnection();
    return await this.client.get(key);
  }

  public async set(
    key: string,
    value: string,
    expireInSeconds?: number
  ): Promise<void> {
    await this.ensureConnection();
    if (expireInSeconds) {
      await this.client.setEx(key, expireInSeconds, value);
    } else {
      await this.client.set(key, value);
    }
  }

  public async setJson(
    key: string,
    value: any,
    expireInSeconds?: number
  ): Promise<void> {
    await this.ensureConnection();
    const jsonValue = JSON.stringify(value);
    if (expireInSeconds) {
      await this.client.setEx(key, expireInSeconds, jsonValue);
    } else {
      await this.client.set(key, jsonValue);
    }
  }

  public async getJson<T>(key: string): Promise<T | null> {
    await this.ensureConnection();
    const value = await this.client.get(key);
    if (!value) return null;

    try {
      return JSON.parse(value) as T;
    } catch (error) {
      console.error("❌ Erro ao parsear JSON do Redis:", error);
      return null;
    }
  }

  public async del(key: string): Promise<number> {
    await this.ensureConnection();
    return await this.client.del(key);
  }

  public async exists(key: string): Promise<boolean> {
    await this.ensureConnection();
    const result = await this.client.exists(key);
    return result === 1;
  }

  public async expire(key: string, expireInSeconds: number): Promise<boolean> {
    await this.ensureConnection();
    const result = await this.client.expire(key, expireInSeconds);
    return result;
  }

  public async ttl(key: string): Promise<number> {
    await this.ensureConnection();
    return await this.client.ttl(key);
  }

  public async flushAll(): Promise<void> {
    await this.ensureConnection();
    await this.client.flushAll();
  }

  public async ping(): Promise<string> {
    await this.ensureConnection();
    return await this.client.ping();
  }
}

export const cacheDb = CacheDbAdapter.getInstance();
