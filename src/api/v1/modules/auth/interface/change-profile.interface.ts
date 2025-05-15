import { Instance } from './instance.interface';

export interface ChangeProfile extends Instance {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
}
