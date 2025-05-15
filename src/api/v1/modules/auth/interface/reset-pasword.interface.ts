import { UserModel } from '../../user/interface/user-model.interface';
import { Instance } from './instance.interface';

export interface ResetPassword extends Instance {
  user: UserModel;
  token: string;
  password: string;
}
