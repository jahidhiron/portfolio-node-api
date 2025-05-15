import { UserTokenModel } from '../../tokens/interface';
import { verifyToken } from './verify-token';

export const verifyResetPasswordToken = (
  user: UserTokenModel,
  token: string
): string => {
  return verifyToken(user.expiredAt as Date, user.code as string, token);
};
