import { UserToken } from '../tokens.entity';

export interface ChangeUserToken {
  instance: UserToken;
  type?: 'account_verification' | 'reset_password';
  isUsed?: boolean;
  expiredAt?: Date;
  userId?: number;
}
