import { Request, Response, NextFunction } from 'express';
import { config } from '../../../config';
import { unauthorizedError } from '../errors';
// import { redis } from '../services';
import { verifyToken } from '../utils/verify-token';
import { JwtTokenPayload } from '../utils/interface';

declare global {
  namespace Express {
    interface Request {
      user?: JwtTokenPayload;
    }
  }
}

export const verifyRefreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const refreshToken = req.headers['authorization']?.split(' ')[1];

  try {
    if (!refreshToken) {
      unauthorizedError(req.__('error-unauthorized'));
      return;
    }

    const user: any = await verifyToken(
      res,
      refreshToken,
      config.JWT_REFRESH_TOKEN_SECRET as string
    );

    // Uncomment and define token checking with Redis if needed
    // const token = await redis.get(refreshToken);
    // if (!token) {
    //   errors.unauthorizedError(req.__('error-unauthorized'));
    // }

    req.user = user; // Attach the user object to the request
    next();
  } catch (error: any) {
    if (error.name === 'Forbidden') {
      //   utils.clearCookie({ res });
    }

    next(error); // Pass the error to the next middleware
  }
};
