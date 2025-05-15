import { TokenType } from '../enum';

export interface TokenPayload {
  type: TokenType;
  user: number;
  expiredAt: Date;
  code: string;
}
