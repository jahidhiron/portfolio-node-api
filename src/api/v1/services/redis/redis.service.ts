import IORedis from 'ioredis';
import { config } from '../../../../config';
import { logger } from '../../../../config/logger.config';
import {
  DEFAULT_CACHING_TIME_IN_SEC,
  RETRY_STRATEGY,
} from '../../../../config/constants';
import { RedisConfig } from './interface/config.interface';

class RedisClient {
  private config: RedisConfig;

  constructor() {
    this.config = {
      host: config.REDIS_HOST,
      port: config.REDIS_PORT,
      // password: config.REDIS_PASSWORD,
      maxRetriesPerRequest: null,
      connectTimeout: 10000,
      lazyConnect: false,
      retryStrategy: (times: number) => {
        const initialDelay = RETRY_STRATEGY.INITIAL_DELAY;
        const maxDelay = RETRY_STRATEGY.MAX_DELAY;
        const delay = Math.min(initialDelay * 2 ** times, maxDelay);
        const jitter =
          Math.random() * RETRY_STRATEGY.MAX_JITTER_RANDOM_VALUE +
          RETRY_STRATEGY.MIN_JITTER;
        return delay * jitter;
      },
    };
  }

  private get client(): IORedis {
    const redis = new IORedis(this.config);

    redis.on('connect', () => {
      logger.info('Connected to Redis');
    });

    redis.on('error', (error: Error) => {
      logger.info('Redis connection error:', error);
    });

    redis.on('close', () => {
      logger.info('Connection to Redis closed');
    });

    process.setMaxListeners(process.getMaxListeners() + 1);

    process.on('SIGINT', async () => {
      try {
        await redis.quit();
        logger.info('Redis client disconnected and app terminated');
        process.exit(0);
      } catch (error) {
        logger.error('Error during app termination:', error);
        process.exit(1);
      }
    });

    return redis;
  }

  public get bullMqClient(): IORedis {
    return new IORedis(this.config);
  }

  public async set(
    key: string,
    data: any,
    EX = DEFAULT_CACHING_TIME_IN_SEC
  ): Promise<void> {
    const stringify = JSON.stringify(data);
    await this.client.set(key, stringify, 'EX', EX);
  }

  public async get(key: string): Promise<any | null> {
    const cached = await this.client.get(key);

    let data = null;
    if (cached) {
      data = JSON.parse(cached);
    }

    return data;
  }

  public async del(key: string): Promise<void> {
    await this.client.del(key);
  }
}

export const redis = new RedisClient();
