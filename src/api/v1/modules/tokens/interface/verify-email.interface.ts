import { TokenType } from '../enum';

export interface VerifyTokenPayload {
  userId: number;
  code: string;
  type: TokenType;
}
