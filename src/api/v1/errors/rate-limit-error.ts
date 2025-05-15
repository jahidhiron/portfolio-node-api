import { CustomError } from './custom-error';

export class RateLimitError extends CustomError {
  constructor(message = 'Too many requests') {
    super(message);
    this.name = 'TooManyRequestsError';
    this.response = false;
    this.statusCode = 429;
    this.message = message;
    Object.setPrototypeOf(this, RateLimitError.prototype);
  }
}
