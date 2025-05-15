import { CustomError } from './custom-error';

export class NotFoundError extends CustomError {
  constructor(message = 'Not found') {
    super(message);
    this.name = 'NotFoundError';
    this.response = false;
    this.statusCode = 404;
    this.message = message;
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}
