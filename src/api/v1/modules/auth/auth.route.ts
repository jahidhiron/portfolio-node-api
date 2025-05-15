import { NextFunction, Request, Response, Router } from 'express';
import { AuthController } from './auth.controller';
import {
  changePasswordValidator,
  forgotPasswordValidator,
  resendVerifyTokenValidator,
  resetPasswordValidator,
  signinValidator,
  signupValidator,
  verifyEmail,
  verifyResetPasswordTokenValidator,
  verifyTokenValidator,
} from './auth.validator';
import { isAuth, isBrandManager, verifyRefreshToken } from '../../middlewares';

const router = Router();
const authController = new AuthController();

const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) =>
    fn(req, res, next).catch(next);

router.post(
  '/signup',
  signupValidator,
  asyncHandler(authController.signup.bind(authController))
);

router.post(
  '/signin',
  signinValidator,
  asyncHandler(authController.signin.bind(authController))
);

router.post(
  '/verify-email',
  verifyEmail,
  asyncHandler(authController.verifyEmail.bind(authController))
);
router.post(
  '/verify-token',
  verifyTokenValidator,
  asyncHandler(authController.verifyToken.bind(authController))
);

router.post(
  '/verify-reset-password-token',
  verifyResetPasswordTokenValidator,
  asyncHandler(authController.verifyResetPasswordToken.bind(authController))
);

router.post(
  '/resend-verify-token',
  resendVerifyTokenValidator,
  asyncHandler(authController.resendEmailVerifyToken.bind(authController))
);

router.get(
  '/refresh-token',
  verifyRefreshToken,
  asyncHandler(authController.generateRefreshToken.bind(authController))
);

router.post(
  '/forgot-password',
  forgotPasswordValidator,
  asyncHandler(authController.forgotPassword.bind(authController))
);

router.post(
  '/reset-password',
  resetPasswordValidator,
  asyncHandler(authController.resetPassword.bind(authController))
);

router.put(
  '/change-password',
  isAuth,
  changePasswordValidator,
  asyncHandler(authController.changePassword.bind(authController))
);

router.put(
  '/update-password/:id',
  isAuth,
  isBrandManager,
  asyncHandler(authController.updatePassword.bind(authController))
);

router.get(
  '/signout',
  isAuth,
  asyncHandler(authController.signout.bind(authController))
);

export default router;
