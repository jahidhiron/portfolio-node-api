import { NextFunction, Request, Response, Router } from 'express';
import { isAuth } from '../../middlewares';
import { UserLoginHistoryController } from './histories.controller';

const router = Router();
const userLoginHistoryController = new UserLoginHistoryController();

const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) =>
    fn(req, res, next).catch(next);

router.get(
  '/',
  isAuth,
  asyncHandler(
    userLoginHistoryController.userLoginHistoryList.bind(
      userLoginHistoryController
    )
  )
);
router.get(
  '/:id',
  isAuth,
  asyncHandler(
    userLoginHistoryController.detailUserLoginHistory.bind(
      userLoginHistoryController
    )
  )
);

router.delete(
  '/:id',
  isAuth,
  asyncHandler(
    userLoginHistoryController.deleteUserLoginHistory.bind(
      userLoginHistoryController
    )
  )
);

export default { router, base: 'histories' };
