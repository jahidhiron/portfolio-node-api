import { NextFunction, Request, Response, Router } from 'express';
import { isAuth } from '../../middlewares';
import { APIRequestController } from './api-request.controller';
import {
  addApiRequestValidator,
  listApiRequestValidator,
} from './api-request.validator';

const router = Router();
const apiRequestController = new APIRequestController();

const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
    (req: Request, res: Response, next: NextFunction) =>
      fn(req, res, next).catch(next);

router.get(
  '/',
  isAuth,
  listApiRequestValidator,
  asyncHandler(apiRequestController.requestList.bind(apiRequestController))
);

router.post(
  '/',
  addApiRequestValidator,
  asyncHandler(apiRequestController.createRequest.bind(apiRequestController))
);

router.get(
  '/statistics',
  isAuth,
  asyncHandler(apiRequestController.getStatistics.bind(apiRequestController))
);

export default { router, base: 'api-requests' };
