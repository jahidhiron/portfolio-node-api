import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/custom-error';
import { CustomErrorResponse } from '../errors/interface/custom-error.interface';
import { config } from '../../../config';
import { NodeEnv } from '../../../config/enums/node-env.enum';

interface ErrorResponse extends CustomErrorResponse {
  correlationId: string | number;
  message: string;
  stack?: string;
}

export const errorHandler = (
  error: Error | CustomError,
  _req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  let response: ErrorResponse = {
    correlationId: (res.get('x-correlation-id') as string) || Date.now(),
    name: 'InternalServerError',
    message: 'Internal server error',
    response: false,
    statusCode: 500,
    errors: [{ message: error.message }],
  };

  if (error instanceof CustomError) {
    response = { ...response, ...error.serializeErrors() };
  }

  if (
    config.NODE_ENV === NodeEnv.Development ||
    config.NODE_ENV === NodeEnv.Stage
  ) {
    response.stack = error.stack;
  }

  if (response.statusCode === 500) {
    /**
     * @TODO
     * invoke send email function to notify system administrator
     */
  }

  // res.locals.errorMessage = response.errors[0].message;

  return res.status(response.statusCode).json(response);
};
