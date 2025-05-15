import { ValidationError } from 'express-validator';
import { CustomError } from './custom-error';
import { BadRequestError } from './bad-request-error';
import { UnauthorizedError } from './unauthorized-error';
import { ForbiddenError } from './forbidden-error';
import { NotFoundError } from './not-found-error';
import { InternalServerError } from './internal-server-error';
import { RequestValidationError } from './request-validation-error';
import { RateLimitError } from './rate-limit-error';
import { ConflictError } from './conflict-error';

export const newError = (message: string): Error => {
  throw new Error(message);
};

export const customeError = (message: string): CustomError => {
  throw new CustomError(message);
};

export const badRequestError = (message: string): BadRequestError => {
  throw new BadRequestError(message);
};

export const unauthorizedError = (message: string): UnauthorizedError => {
  throw new UnauthorizedError(message);
};

export const forbiddenError = (message: string): ForbiddenError => {
  throw new ForbiddenError(message);
};

export const notFoundError = (message: string): NotFoundError => {
  throw new NotFoundError(message);
};

export const internalServerError = (message: string): InternalServerError => {
  throw new InternalServerError(message);
};

export const requestValidationError = (errors: ValidationError[]) => {
  throw new RequestValidationError(errors);
};

export const rateLimitError = (message: string): RateLimitError => {
  throw new RateLimitError(message);
};

export const conflictError = (message: string): ConflictError => {
  throw new ConflictError(message);
};
