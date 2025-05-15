import winston, { Logger } from 'winston';
import { config } from './env.config';

const { format, createLogger, transports } = winston;

const winstonFormat = format.printf(
  ({ timestamp, level, message, stack }: winston.Logform.TransformableInfo) =>
    `${timestamp}: ${level}: ${stack || message}`
);

const level: string = config.NODE_ENV === 'development' ? 'debug' : 'info';
const colorize =
  config.NODE_ENV === 'development' ? format.colorize() : format.uncolorize();

export const logger: Logger = createLogger({
  level,
  format: format.combine(format.timestamp(), winstonFormat, colorize),
  transports: [new transports.Console()],
});
