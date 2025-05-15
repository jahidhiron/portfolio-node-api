import http from 'http';
import dotenv from 'dotenv';
dotenv.config();

import { initServer } from './app';
import { config, logger } from './config';
import { connectPostgresqlDB } from './api/v1/init';

const exitHandler = (server: http.Server | undefined): void => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unExpectedErrorHandler =
  (server: http.Server | undefined) =>
  (error: Error): void => {
    logger.error(error);
    exitHandler(server);
  };

export const startServer = async (
  port: number | undefined
): Promise<
  | http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>
  | undefined
> => {
  try {
    // const configError = validateConfig();
    // if (configError) {
    //   logger.error(configError);
    //   process.exit(1);
    // }
    const app = await initServer();
    const httpServer = http.createServer(app);

    await connectPostgresqlDB();

    const server = httpServer.listen(port, () => {
      logger.info(`Auto Viz server listening on port ${port}`);
    });

    process.on('uncaughtException', unExpectedErrorHandler(server));
    process.on('unhandledRejection', unExpectedErrorHandler(server));
    process.on('SIGTERM', () => {
      logger.info('SIGTERM recieved');
      if (server) {
        server.close();
      }
    });

    return httpServer;
  } catch (error: any) {
    console.error('Error starting the server:', error);
  }
};

(async () => {
  await startServer(config.PORT);
})();
