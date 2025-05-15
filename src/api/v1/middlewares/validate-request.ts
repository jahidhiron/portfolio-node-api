import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationError } from 'express-validator';
import { requestValidationError } from '../errors';

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorArray = errors.array().map((error: ValidationError) => {
      if (
        typeof error.msg === 'object' &&
        !Array.isArray(error.msg) &&
        error.msg.key &&
        error.msg !== null
      ) {
        const { key, field } = error.msg as { key: string; field: string };
        error.msg = res.__(key, { field }) as string;
      } else if (
        typeof error.msg === 'string' &&
        error.msg.split(' ').length === 1
      ) {
        error.msg = res.__(error.msg);
      }
      return error;
    });
    requestValidationError(errorArray);
  }

  next();
};
