import {
  isEmailRequired,
  isNumeric,
  isPasswordRequired,
  isRequired,
} from '../../helpers/validator';
import { validateRequest } from '../../middlewares';

const emailValidator = [isEmailRequired('email'), validateRequest];

export const signupValidator = [
  isRequired('firstName', 'First name'),
  isRequired('lastName', 'Last name'),
  isEmailRequired('email'),
  isPasswordRequired(),
  isRequired('role', 'Role'),
  validateRequest,
];

export const signinValidator = [
  isEmailRequired('email'),
  isPasswordRequired(),
  validateRequest,
];

export const verifyEmail = [
  isEmailRequired('email'),
  isRequired('token'),
  validateRequest,
];

export const verifyTokenValidator = [
  isEmailRequired('email'),
  isRequired('token'),
  validateRequest,
];

export const verifyResetPasswordTokenValidator = [
  isEmailRequired('email'),
  isRequired('token'),
  validateRequest,
];

export const resendVerifyTokenValidator = emailValidator;

export const forgotPasswordValidator = emailValidator;

export const resetPasswordValidator = [
  isPasswordRequired(),
  isRequired('token'),
  ...emailValidator,
];

export const changePasswordValidator = [
  isPasswordRequired('oldPassword', 'Old password'),
  isPasswordRequired('newPassword', 'New password'),
  validateRequest,
];
