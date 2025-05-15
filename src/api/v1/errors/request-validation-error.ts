import { ValidationError } from 'express-validator';
import { CustomError } from './custom-error';
import { CustomErrorResponse } from './interface/custom-error.interface';
import { CustomValidationError } from './interface/custom-validation-error.interface';

export class RequestValidationError extends CustomError {
  public name: string;
  public response: boolean;
  public statusCode: number;
  public errors: CustomValidationError[];
  public message: string;

  constructor(
    errors: ValidationError[],
    message: string = 'Invalid request parameters'
  ) {
    super(message);

    this.name = 'InvalidRequestParametersError';
    this.response = false;
    this.statusCode = 400;
    this.errors = errors;
    this.message = message;
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors(): CustomErrorResponse {
    return {
      name: this.name,
      message: this.message,
      response: this.response,
      statusCode: this.statusCode,
      errors: this.errors
        .map((error) => {
          return {
            message: error.msg as string,
            field: error.path as string,
            location: error.location as string,
          };
        })
        .filter(
          (value, index, self) =>
            index === self.findIndex((t) => t.field === value.field)
        ),
    };
  }
}
