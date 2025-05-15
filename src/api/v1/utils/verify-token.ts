import jwt, { JwtPayload } from 'jsonwebtoken';
import { forbiddenError } from '../errors';
import { UnauthorizedError } from '../errors/unauthorized-error';
import { Response } from 'express';
import { User } from '../modules/user/user.entity';
import { JwtTokenPayload } from './interface';

declare global {
  namespace Express {
    interface Request {
      user?: JwtTokenPayload;
    }
  }
}

interface CustomJwtPayload extends JwtPayload {
  id: number;
  email: string;
  role: number;
  aud?: string;
}

export const verifyToken = (
  res: Response,
  token: string,
  secret: string
): Promise<JwtTokenPayload> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (error: any, payload: any) => {
      if (error) {
        if (error.name === 'TokenExpiredError') {
          return reject(forbiddenError(res.__('error-forbidden')));
        }

        const message =
          error.name === 'JsonWebTokenError'
            ? res.__('error-unauthorized')
            : error.message;

        return reject(new UnauthorizedError(message));
      }

      const user = { ...payload } as JwtTokenPayload;

      resolve(user);
    });
  });
};
