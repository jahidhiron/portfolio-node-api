import { UserModel } from '../../user/interface/user-model.interface';
import { Instance } from './instance.interface';

export interface ChangePassword extends Instance {
  password: string;
}
