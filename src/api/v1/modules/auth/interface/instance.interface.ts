import { User } from '../../user/user.entity';

export interface Instance {
  instance: User;
  ip?: string;
}
