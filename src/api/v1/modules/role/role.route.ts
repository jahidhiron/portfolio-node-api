import { NextFunction, Request, Response, Router } from 'express';
import { isAdmin, isAuth } from '../../middlewares';
import { RoleController } from './role.controller';
import { addRoleValidator } from './role.validator';

const router = Router();
const roleController = new RoleController();

const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) =>
    fn(req, res, next).catch(next);

router.get(
  '/',
  isAuth,
  asyncHandler(roleController.roleList.bind(roleController))
);

router.get(
  '/:id',
  isAuth,
  asyncHandler(roleController.detailRole.bind(roleController))
);

router.post(
  '/',
  isAuth,
  isAdmin,
  addRoleValidator,
  asyncHandler(roleController.createRole.bind(roleController))
);

router.put(
  '/:id',
  isAuth,
  isAdmin,
  asyncHandler(roleController.updateRole.bind(roleController))
);

router.delete(
  '/:id',
  isAuth,
  isAdmin,
  asyncHandler(roleController.deleteRole.bind(roleController))
);

export default { router, base: 'roles' };
