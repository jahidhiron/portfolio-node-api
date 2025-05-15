import jwt, { SignOptions } from 'jsonwebtoken';
import { internalServerError } from '../errors';
import { config } from '../../../config';

interface JwtPayload {
  [key: string]: any;
  aud?: string;
}

interface JwtOptions {
  payload: JwtPayload;
  expiresIn: string | number;
  secret: string;
}

export const generateJwtToken = ({
  payload,
  expiresIn,
  secret,
}: JwtOptions): Promise<string> => {
  return new Promise((resolve, reject) => {
    const copy: JwtPayload = { ...payload };

    const options: SignOptions = {
      expiresIn:
        typeof expiresIn === 'number'
          ? expiresIn
          : (expiresIn as SignOptions['expiresIn']),
      issuer: config.APP_NAME,
      audience: copy.aud,
    };

    delete copy.aud;

    jwt.sign(copy, secret, options, (error, token) => {
      if (error) {
        return reject(internalServerError(error.message));
      }
      resolve(token as string);
    });
  });
};
