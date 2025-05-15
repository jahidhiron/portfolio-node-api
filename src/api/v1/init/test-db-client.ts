import { Client } from 'pg';
import { config } from '../../../config';

export const testDbClient = () => {
  const client = new Client({
    user: config.POSTGRES_USERNAME,
    host: config.POSTGRES_CONTAINER,
    database: config.DIALECT,
    password: config.POSTGRES_PASSWORD,
    port: parseInt(config.POSTGRES_PORT as string, 10),
  });

  return client;
};
