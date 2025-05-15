import { CustomError } from './custom-error';

export class ForbiddenError extends CustomError {
  constructor(message = 'Forbidden') {
    super(message);
    this.name = 'ForbiddenError';
    this.response = false;
    this.statusCode = 403;
    this.message = message;
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}
