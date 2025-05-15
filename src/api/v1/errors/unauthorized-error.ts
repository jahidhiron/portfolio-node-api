import { CustomError } from './custom-error';

export class UnauthorizedError extends CustomError {
  constructor(message = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
    this.response = false;
    this.statusCode = 401;
    this.message = message;
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}
