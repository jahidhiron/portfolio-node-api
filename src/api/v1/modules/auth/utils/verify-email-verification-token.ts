import { UserTokenModel } from '../../tokens/interface';
import { verifyToken } from './verify-token';

export const verifyEmailVerificationToken = ({
  user,
  token,
}: {
  user: UserTokenModel;
  token: string;
}): string => {
  const result = verifyToken(
    user.expiredAt as Date,
    user.code as string,
    token
  );
  return result;
};
