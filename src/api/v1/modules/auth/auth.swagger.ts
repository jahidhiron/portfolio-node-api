import UserSchema from '../user/swagger/schema.swagger.json';
import authInfo from './swagger/info.swagger.json';
import basePath from './swagger/base-path.swagger.json';
import signupPath from './swagger/signup.swagger.json';
import signinPath from './swagger/signin.swagger.json';
import verifyEmailPath from './swagger/verify-email.swagger.json';
import resendEmailVerifyTokenPath from './swagger/resend-verify-token.swagger.json';
import generateRefreshTokenPath from './swagger/generate-refresh-token.swagger.json';
import forgotPasswordPath from './swagger/forgot-password.swagger.json';
import resetPasswordPath from './swagger/reset-password.swagger.json';
import updatePassword from './swagger/update-password.swagger.json';
import changePasswordPath from './swagger/change-password.swagger.json';
import signoutPath from './swagger/signout.swagger.json';
import verifyResetPasswordTokenPath from './swagger/verify-reset-password-token.swagger.json';
export const authSwagger = {
  openapi: '3.0.0',
  ...authInfo,
  security: [
    {
      bearerAuth: [],
    },
  ],
  paths: {
    ...signupPath,
    ...signinPath,
    ...verifyEmailPath,
    ...resendEmailVerifyTokenPath,
    ...generateRefreshTokenPath,
    ...forgotPasswordPath,
    ...resetPasswordPath,
    ...changePasswordPath,

    ...verifyResetPasswordTokenPath,
    ...signoutPath,
    '/auth/update-password/{id}': {
      ...updatePassword,
    },
  },

  components: {
    ...UserSchema,
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};
