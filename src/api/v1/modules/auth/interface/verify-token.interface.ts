import { TokenType } from '../../tokens/enum';
import { UserModel } from '../../user/interface/user-model.interface';
import { Instance } from './instance.interface';

export interface VerifyToken extends Instance {
  user: UserModel;
  token: string;
  password?: string;
}
