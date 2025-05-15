import path from 'path';
import { Request, Response, NextFunction } from 'express';
import { FileService } from './file.service';
import { notFoundError, badRequestError } from '../../errors';
import { successResponse } from '../../helpers/success-response';
import { validateExtension } from './file.validator';
import { s3Bucket } from '../../services/';

export class FileController {
  private fileService: FileService;

  constructor() {
    this.fileService = new FileService();
  }

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { sorting, ...rest } = req.query;
    const payload = { ...rest };
    if (sorting) {
      const parsedSorting = JSON.parse(req?.query?.sorting as string);
      payload.sorting = parsedSorting;
    }

    try {
      const { collection: files, meta } = await this.fileService.fileList(
        payload as any
      );

      successResponse({
        res,
        msg: 'succ-file-list',
        files,
        meta,
      });
    } catch (error) {
      next(error);
    }
  }

  async detail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { data: file } = await this.fileService.detailFile({
        path: req.query.path as string,
      });
      if (!file) {
        throw notFoundError(req.__('error-file-not-found'));
      }
      successResponse({
        res,
        msg: 'succ-detail-file',
        file,
      });
    } catch (error) {
      next(error);
    }
  }

  async upload(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        throw badRequestError(req.__('error-file-not-selected'));
      }
      const newFiles = [];
      for (const file of files) {
        const ext = path.extname(file.originalname);
        const isValidExt = validateExtension(ext);
        if (!isValidExt) {
          throw badRequestError(req.__('error-invalid-file-type'));
        }
        const key = await s3Bucket.apiFileUpload({
          ...file,
          ext,
          prefix: req?.body?.prefix,
        });
        if (key) {
          const { data: newFile } = await this.fileService.addFile({
            ...req.file,
            size: file?.size,
            mimetype: file?.mimetype,
            path: key,
          });
          newFiles.push(newFile);
        } else {
          throw badRequestError(req.__('error-try-again'));
        }
      }

      successResponse({
        res,
        msg: 'succ-file-upload',
        statusCode: 201,
        files: newFiles,
      });
    } catch (error) {
      next(error);
    }
  }

  async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { data: file } = await this.fileService.findOneFile({
        path: req.query.path as string,
      });
      if (!file) {
        throw notFoundError(req.__('error-file-not-found'));
      }
      await s3Bucket.removeFile(file.path);
      await this.fileService.deleteFile({ id: file.id });
      successResponse({
        res,
        msg: 'succ-delete-file',
      });
    } catch (error) {
      next(error);
    }
  }
}
