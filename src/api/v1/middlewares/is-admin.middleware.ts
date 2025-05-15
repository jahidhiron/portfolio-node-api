import { Request, Response, NextFunction } from 'express';
import { forbiddenError } from '../errors';
import { JwtTokenPayload } from '../utils/interface';
import { RoleType } from './enums';

declare global {
  namespace Express {
    interface Request {
      user?: JwtTokenPayload;
    }
  }
}

export const isAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const { role } = req;
    if (role?.name?.toLowerCase() === RoleType.Admin) {
      return next();
    }
    forbiddenError(req.__('permission-denied'));
  } catch (error) {
    next(error);
  }
};
