import { scrypt } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

interface ComparePassword {
  (storedPassword: string, suppliedPassword: string): Promise<boolean>;
}

export const comparePassword: ComparePassword = async (
  storedPassword: string,
  suppliedPassword: string
): Promise<boolean> => {
  const [hashedPassword, salt] = storedPassword.split('.');
  const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;
  return buf.toString('hex') === hashedPassword;
};
