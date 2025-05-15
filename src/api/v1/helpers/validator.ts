import {
  body,
  param,
  query,
  header,
  cookie,
  ValidationChain,
} from 'express-validator';
import * as utils from '../utils';

class Validator {
  private chain: ValidationChain;
  private field: string;
  private fieldName: string;

  constructor(
    field: string,
    fieldName: string | null = null,
    location: (field: string) => ValidationChain = body
  ) {
    this.chain = location(field);
    this.field = field;
    this.fieldName = fieldName || utils.capitalize(field);
  }

  private generateMessage(msg: string | { key: string; field?: string }) {
    if (typeof msg === 'object' && msg.key) {
      return {
        key: msg.key,
        field:
          msg.field ||
          utils.capitalize(this.fieldName) ||
          utils.capitalize(this.field),
      };
    }
    return msg;
  }

  public isRequired(): ValidationChain {
    this.chain = this.chain
      .notEmpty()
      .withMessage(this.generateMessage({ key: 'val-field-required' }));
    return this.chain;
  }

  public isNumeric(): ValidationChain {
    this.chain = this.chain
      .optional()
      .isNumeric()
      .withMessage(this.generateMessage({ key: 'val-numeric-value' }));
    return this.chain;
  }

  public isNumericRequired(): ValidationChain {
    this.chain = this.isRequired()
      .isNumeric()
      .withMessage(this.generateMessage({ key: 'val-numeric-value' }));
    return this.chain;
  }

  public isIn(values: any[]): ValidationChain {
    this.chain = this.chain
      .isIn(values)
      .withMessage(this.generateMessage({ key: 'val-invalid-value' }));
    return this.chain;
  }

  public isEmail(): ValidationChain {
    this.chain = this.chain
      .isEmail()
      .withMessage(this.generateMessage({ key: 'val-invalid-email' }));
    return this.chain;
  }

  public isEmailRequired(): ValidationChain {
    this.chain = this.isRequired()
      .isEmail()
      .withMessage(this.generateMessage({ key: 'val-invalid-email' }));
    return this.chain;
  }

  public isPassword(length: { min: number; max: number }): ValidationChain {
    this.chain = this.chain
      .trim()
      .isLength(length)
      .withMessage(this.generateMessage({ key: 'val-password-requirement' }));
    return this.chain;
  }

  public isPasswordRequired(length: {
    min: number;
    max: number;
  }): ValidationChain {
    this.chain = this.isRequired()
      .trim()
      .isLength(length)
      .withMessage(this.generateMessage({ key: 'val-password-requirement' }));
    return this.chain;
  }

  public isPhone(): ValidationChain {
    this.chain = this.chain
      .trim()
      .optional()
      .isMobilePhone('en-US', { strictMode: false })
      .withMessage(this.generateMessage({ key: 'val-phone-number' }));
    return this.chain;
  }

  public isPhoneRequired(): ValidationChain {
    this.chain = this.isRequired()
      .trim()
      .optional()
      .isMobilePhone('en-US', { strictMode: false })
      .withMessage(this.generateMessage({ key: 'val-phone-number' }));
    return this.chain;
  }
}

export const isRequired = (
  field: string,
  fieldName: string | null = null,
  location: (field: string) => ValidationChain = body
): ValidationChain => new Validator(field, fieldName, location).isRequired();

export const isEmail = (
  field: string = 'email',
  fieldName: string = 'Email',
  location: (field: string) => ValidationChain = body
): ValidationChain => new Validator(field, fieldName, location).isEmail();

export const isEmailRequired = (
  field: string = 'email',
  fieldName: string = 'Email',
  location: (field: string) => ValidationChain = body
): ValidationChain =>
  new Validator(field, fieldName, location).isEmailRequired();

export const isNumeric = (
  field: string,
  fieldName: string | null = null,
  location: (field: string) => ValidationChain = body
): ValidationChain => new Validator(field, fieldName, location).isNumeric();

export const isNumericRequired = (
  field: string,
  fieldName: string | null = null,
  location: (field: string) => ValidationChain = body
): ValidationChain =>
  new Validator(field, fieldName, location).isNumericRequired();

export const isPassword = (
  field: string = 'password',
  fieldName: string | null = 'Password',
  location: (field: string) => ValidationChain = body,
  length: { min: number; max: number } = { min: 6, max: 64 }
): ValidationChain =>
  new Validator(field, fieldName, location).isPassword(length);

export const isPasswordRequired = (
  field: string = 'password',
  fieldName: string | null = 'Password',
  location: (field: string) => ValidationChain = body,
  length: { min: number; max: number } = { min: 6, max: 64 }
): ValidationChain =>
  new Validator(field, fieldName, location).isPasswordRequired(length);

export const isPhone = (
  field: string,
  fieldName: string | null = null,
  location: (field: string) => ValidationChain = body,
  length: { min: number; max: number }
): ValidationChain => new Validator(field, fieldName, location).isPhone();

export const isPhoneRequired = (
  field: string,
  fieldName: string | null = null,
  location: (field: string) => ValidationChain = body,
  length: { min: number; max: number }
): ValidationChain =>
  new Validator(field, fieldName, location).isPhoneRequired();

export { body, param, query, header, cookie };
