import { CompanyModel } from '../../company/interface';
import { RoleModel } from '../../role/interface';

export interface UserModel {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: RoleModel;
  company: CompanyModel;
  isActive: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  hashPasswordBeforeInsert(): Promise<void>;
}
