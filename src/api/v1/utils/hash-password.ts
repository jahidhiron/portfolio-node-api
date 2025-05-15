import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

export const hashPassword = async (password: string): Promise<string> => {
  const salt = randomBytes(8).toString('hex');

  const buf = (await scryptAsync(password, salt, 64)) as Buffer;

  const hashedPassword = `${buf.toString('hex')}.${salt}`;

  return hashedPassword;
};
