import { UserModel } from '../../user/interface';
import { UserLoginHistory } from '../histories.entity';

export interface ChangeUserLoginHistory {
  instance: UserLoginHistory;
  userId?: number;
  user?: Partial<UserModel>;
  loginAt?: Date;
  ip_address?: string;
}
