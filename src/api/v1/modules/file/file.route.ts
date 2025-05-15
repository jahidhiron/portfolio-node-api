import { Router, Request, Response, NextFunction } from 'express';
import { FileController } from './file.controller';
import { isAuth, isAdmin, upload } from '../../middlewares';

const router = Router();
const fileController = new FileController();

const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) =>
    fn(req, res, next).catch(next);

router.get(
  '/',
  isAuth,
  isAdmin,
  asyncHandler(fileController.list.bind(fileController))
);

router.post(
  '/upload',
  isAuth,
  upload.array('files', 10),
  asyncHandler(fileController.upload.bind(fileController))
);

router.get('/detail', asyncHandler(fileController.detail.bind(fileController)));

router.delete(
  '/',
  isAuth,
  asyncHandler(fileController.remove.bind(fileController))
);

export default { router, base: 'files' };
