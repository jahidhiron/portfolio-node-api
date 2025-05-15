import { Request, Response, NextFunction } from 'express';
import { generateCode } from '../utils';

declare global {
  namespace Express {
    interface Request {
      clientIp?: string;
    }
  }
}

export const processRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || null;

  let correlationId = req.headers['x-correlation-id'] as string;
  if (!correlationId) {
    correlationId = `${Date.now().toString()}_${generateCode(8)}`;
  }

  req.headers['x-correlation-id'] = correlationId;
  req.clientIp = ip as string;
  res.set('x-correlation-id', correlationId);

  next();
};
