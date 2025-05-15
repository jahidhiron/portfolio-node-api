import 'reflect-metadata';
import express, { Express, NextFunction, Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import { config, morganErrorHandler, morganSuccessHandler } from './config';
import { i18n } from './api/v1/locales/i18n';
import { setupRoute } from './api/v1/routes';
import { CONTENT_SECURITY_POLICY } from './api/v1/constants';
import {
  errorHandler,
  notFoundRequest,
  processRequest,
  swaggerAuth,
} from './api/v1/middlewares';
import { CustomError } from './api/v1/errors/custom-error';
import { swaggerOptions } from './config/swagger.config';

export const initServer = async (): Promise<Express> => {
  const app = express();

  /**
   * middlewares
   */
  app.use(
    cors({
      origin: true,
      credentials: true,
      //origin: [adminCloudOrigin, adminLocalOrigin], // ToDo: Allowing all cors for now. Will review later
    })
  );

  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));
  app.use(cookieParser());
  app.use(
    helmet.contentSecurityPolicy({
      ...CONTENT_SECURITY_POLICY,
      reportOnly: true,
    })
  );

  app.use(morganSuccessHandler);
  app.use(morganErrorHandler);
  app.use(i18n.init);
  app.use(processRequest);

  app.use(
    '/api-docs',
    swaggerAuth,
    swaggerUi.serve,
    swaggerUi.setup(swaggerOptions)
  );

  await setupRoute(app);

  app.get('/', (_req: Request, res: Response) => {
    res.status(200).json({
      name: 'OK',
      statusCode: 200,
      response: true,
      message: 'portfolio Server is running on',
    });
  });

  app.use('*', notFoundRequest);
  app.use(
    (
      error: Error | CustomError,
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      errorHandler(error, req, res, next);
    }
  );

  return app;
};
