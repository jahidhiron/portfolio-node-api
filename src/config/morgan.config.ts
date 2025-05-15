import fs from 'fs';
import path from 'path';
import morgan, { StreamOptions } from 'morgan';
import { config } from './env.config';
import { Request, Response } from 'express';

morgan.token(
  'message',
  (req: Request, res: Response) => res.locals.errorMessage || ''
);

const getIPFormat = (): string =>
  config.NODE_ENV === 'production' ? ':remote-addr - ' : '';

const logsDir = path.join(__dirname, '../logs');

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, '../logs/access.log'),
  { flags: 'a' }
);

const successResponseFormat = `${getIPFormat()} :method :url :status :response-time ms :user-agent :date`;
export const morganSuccessHandler = morgan(successResponseFormat, {
  stream: accessLogStream as StreamOptions,
  skip: (_req, res) => res.statusCode >= 400,
});

const errorResponseFormat = `${getIPFormat()} :method :url :status :response-time ms :user-agent :date - error-message: :message`;
export const morganErrorHandler = morgan(errorResponseFormat, {
  stream: accessLogStream as StreamOptions,
  skip: (_req, res) => res.statusCode < 400,
});
