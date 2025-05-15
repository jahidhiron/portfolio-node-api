import { UserModel } from '../../user/interface';

export interface UserLoginHistoryModel {
  id?: number;
  user: Partial<UserModel>;
  loginAt?: Date;
  ipAddress?: string;
}
