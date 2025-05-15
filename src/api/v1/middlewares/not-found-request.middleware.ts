import { Request, Response, NextFunction } from 'express';
import { notFoundError } from '../errors';

export const notFoundRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const notfound = notFoundError(req.__('error-api-not-found'));

    const response = {
      correlationId: res.get('x-correlation-id'),
      ...notfound.serializeErrors(),
    };

    res.status(response.statusCode).json(response);
  } catch (error) {
    next(error);
  }
};
