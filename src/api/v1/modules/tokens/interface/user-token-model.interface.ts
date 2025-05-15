import { TokenType } from '../enum';

export interface UserTokenModel {
  id?: number;
  code: string;
  type: TokenType;
  isUsed?: boolean;
  createdAt?: Date;
  expiredAt?: Date;
  user: number;
}
