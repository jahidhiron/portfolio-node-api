import { UserModel } from '../../user/interface';

export interface FileModel {
  id?: number;
  path: string;
  size: number;
  mimetype: string;
  createdAt: Date;
  updatedAt: Date;
  updatedBy?: UserModel;
}
