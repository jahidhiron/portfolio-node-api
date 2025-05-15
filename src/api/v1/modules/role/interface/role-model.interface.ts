import { UserModel } from '../../user/interface';

export interface RoleModel {
  id?: number;
  name: string;
  users?: UserModel[];
  createdAt: Date;
  updatedAt: Date;
}
