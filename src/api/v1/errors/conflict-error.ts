import { CustomError } from './custom-error';

export class ConflictError extends CustomError {
  constructor(message = 'Conflict') {
    super(message);
    this.name = 'ConflictError';
    this.response = false;
    this.statusCode = 409;
    this.message = message;
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}
