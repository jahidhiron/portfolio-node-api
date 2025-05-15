import { NextFunction, Request, Response, Router } from 'express';
import { UserController } from './user.controller';
import { isAdmin, isAuth, isBrandManager } from '../../middlewares';

const router = Router();
const userController = new UserController();

const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) =>
    fn(req, res, next).catch(next);

router.get(
  '/',
  isAuth,
  isBrandManager,
  asyncHandler(userController.userList.bind(userController))
);

router.get(
  '/company-users',
  isAuth,
  isBrandManager,
  asyncHandler(userController.companyUserList.bind(userController))
);

router.post(
  '/',
  isAuth,
  isBrandManager,
  asyncHandler(userController.createUser.bind(userController))
);

router.get(
  '/current',
  isAuth,
  asyncHandler(userController.currentUser.bind(userController))
);

router.get(
  '/:id',
  isAuth,
  asyncHandler(userController.detailUser.bind(userController))
);

router.put(
  '/:id',
  isAuth,
  asyncHandler(userController.updateUser.bind(userController))
);

router.delete(
  '/:id',
  isAuth,
  asyncHandler(userController.deleteUser.bind(userController))
);

export default { router, base: 'users' };
