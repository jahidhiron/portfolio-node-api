import { Request, Response, NextFunction } from 'express';
import { unauthorizedError } from '../errors';
import { config } from '../../../config';
import { verifyToken } from '../utils/verify-token';
import { JwtTokenPayload } from '../utils/interface';
import { RoleModel } from '../modules/role/interface';
import { RoleService } from '../modules/role/role.service';

declare global {
  namespace Express {
    interface Request {
      user?: JwtTokenPayload;
      role?: RoleModel;
    }
  }
}

export const isAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const roleService = new RoleService();
  const accessToken = req.headers.authorization?.split(' ')[1];

  try {
    if (!accessToken) {
      unauthorizedError(req.__('error-unauthorized'));
    }

    // The logic for backlist checking is commented out, you can uncomment it when needed
    // const backlist = await redis.get(accessToken);
    // if (backlist) {
    //   unauthorizedError(req.__('error-unauthorized'));
    // }

    const user: any = await verifyToken(
      res,
      accessToken as string,
      config.JWT_ACCESS_TOKEN_SECRET as string
    );

    const role = await roleService.findOneRole({ id: user.roleId });
    if (!role) {
      unauthorizedError(req.__('error-role-not-found'));
    }

    req.user = user;
    req.role = role.data!;

    next();
  } catch (error) {
    // if (error.name === 'Forbidden') {
    //   // Add type for the `clearCookie` function if necessary
    //   utils.clearCookie({ res, refreshToken: false });
    // }
    next(error);
  }
};
