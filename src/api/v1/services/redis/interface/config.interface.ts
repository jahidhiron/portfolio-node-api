export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  maxRetriesPerRequest?: null;
  connectTimeout: number;
  lazyConnect: boolean;
  retryStrategy: (times: number) => number;
}
