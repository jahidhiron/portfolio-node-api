import { NodeEnv } from './enums/node-env.enum';

export const config = {
  // app
  NODE_ENV: process.env.NODE_ENV || NodeEnv.Development,
  HOST: process.env.HOST,
  PORT: parseInt(process.env.PORT as string, 10),
  ADMIN_LOCAL_ORIGIN: process.env.ADMIN_LOCAL_ORIGIN,
  ADMIN_CLOUD_ORIGIN: process.env.ADMIN_CLOUD_ORIGIN,
  APP_NAME: process.env.APP_NAME,
  PASSWORD_SALT: process.env.PASSWORD_SALT,

  // swagger
  SWAGGER_USER: process.env.SWAGGER_USER,
  SWAGGER_PASSWORD: process.env.SWAGGER_PASSWORD,
  // jwt
  JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET,
  JWT_ACCESS_TOKEN_EXPIRED_IN: process.env.JWT_ACCESS_TOKEN_EXPIRED_IN,
  JWT_REFRESH_TOKEN_EXPIRED_IN: process.env.JWT_REFRESH_TOKEN_EXPIRED_IN,

  // postgresql
  DIALECT: process.env.DIALECT,
  POSTGRES_CONTAINER: process.env.POSTGRES_CONTAINER,
  POSTGRES_PORT: process.env.POSTGRES_PORT,
  POSTGRES_DATABASE: process.env.POSTGRES_DATABASE,
  POSTGRES_USERNAME: process.env.POSTGRES_USERNAME,
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
  POSTGRES_VOLUME: process.env.POSTGRES_VOLUME,

  // mailing
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  SENDGRID_MAIL_FROM: process.env.SENDGRID_MAIL_FROM,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,

  // redis
  REDIS_HOST: process.env.REDIS_CONTAINER || '',
  REDIS_PORT: parseInt(process.env.REDIS_PORT as string, 10),
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || '',

  // aws
  AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
  AWS_SECRET_KEY: process.env.AWS_SECRET_KEY,
  AWS_REGION: process.env.AWS_REGION,
  AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,
};
