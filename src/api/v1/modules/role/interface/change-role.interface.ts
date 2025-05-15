import { Role } from '../role.entity';
import { User } from '../../user/user.entity';

export interface ChangeRole {
  instance: Role;
  name?: string;
  users?: User[];
}
