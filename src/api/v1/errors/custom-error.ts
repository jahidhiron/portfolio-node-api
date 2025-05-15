import { CustomErrorResponse } from './interface/custom-error.interface';

export class CustomError extends Error {
  public response: boolean;
  public statusCode: number;

  constructor(message: string = 'Bad request') {
    super(message);
    this.name = 'BadRequestError';
    this.response = false;
    this.statusCode = 400;
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  serializeErrors(): CustomErrorResponse {
    return {
      response: this.response,
      statusCode: this.statusCode,
      name: this.name,
      message: this.message,
      errors: [{ message: this.message }],
    };
  }
}
