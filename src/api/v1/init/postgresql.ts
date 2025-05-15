import { AppDataSource, logger, config } from '../../../config';

export const connectPostgresqlDB = async () => {
  try {
    await AppDataSource.initialize();
    logger.info('Postgresql database connection successful');

    const db = await AppDataSource.query(
      `SELECT 1 FROM pg_database WHERE datname = '${config.POSTGRES_DATABASE}';`
    );

    if (db.length === 0) {
      await AppDataSource.query(
        `CREATE DATABASE "${config.POSTGRES_DATABASE}";`
      );
      logger.info(
        `Database "${config.POSTGRES_DATABASE}" created successfully`
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      logger.error('Error to connect database:', error);
    } else {
      logger.error('Unknown error occurred during database connection', error);
    }
  }
};
