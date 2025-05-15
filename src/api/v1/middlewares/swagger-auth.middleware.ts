import basicAuth from 'basic-auth';
import { config } from '../../../config';

import { NextFunction, Request, Response } from 'express';

const swaggerUser = config.SWAGGER_USER as string;
const swaggerPassword = config.SWAGGER_PASSWORD as string;

export const swaggerAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = basicAuth(req);
  if (!user || user.name !== swaggerUser || user.pass !== swaggerPassword) {
    res.set('WWW-Authenticate', 'Basic realm="Swagger Docs"');
    res.status(401).send('Authentication required.');
    return;
  }

  next();
};
