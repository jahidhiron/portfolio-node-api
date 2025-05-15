import { Response } from 'express';

interface ResponseBody {
  name: string;
  statusCode: number;
  response: boolean;
  message: string;
  data?: Record<string, any>;
}

interface ResponseOptions {
  res: Response;
  msg: string;
  statusCode?: number;
  [key: string]: any;
}

export const successResponse = ({
  res,
  msg,
  statusCode = 200,
  ...rest
}: ResponseOptions): Response => {
  const response: ResponseBody = {
    name: statusCode === 201 ? 'Created' : 'OK',
    statusCode,
    response: true,
    message: res.__(msg),
  };

  if (Object.keys(rest).length > 0) {
    response.data = { ...rest };
  }

  return res.status(statusCode).json(response);
};
