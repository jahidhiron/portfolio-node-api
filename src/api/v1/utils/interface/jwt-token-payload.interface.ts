import { JwtPayload } from 'jsonwebtoken';

export interface JwtTokenPayload extends JwtPayload {
  firstName: string;
  lastName: string;
  email: string;
  id: number;
  verified: boolean;
  roleId: number;
  companyId: number;
}
