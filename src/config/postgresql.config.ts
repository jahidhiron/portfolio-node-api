import { DataSource } from 'typeorm';
import { User } from '../api/v1/modules/user/user.entity';
import { config } from './index';
import { DbType } from './enums/db-type.enum';
import { NodeEnv } from './enums/node-env.enum';
import { Company } from '../api/v1/modules/company/company.entity';
import { Domain } from '../api/v1/modules/domain/domain.entity';
import { Request } from '../api/v1/modules/request/request.entity';
import { Wheel } from '../api/v1/modules/wheel/wheel.entity';
import { CompanyProductWheelMapping } from '../api/v1/modules/configurator/configurator.entity';
import { Role } from '../api/v1/modules/role/role.entity';
import { DbNamingStrategy } from './db-naming-strategy';
import { UserToken } from '../api/v1/modules/tokens/tokens.entity';
import { UserLoginHistory } from '../api/v1/modules/histories/histories.entity';
import { File } from '../api/v1/modules/file/file.entity';
import { APIRequest } from '../api/v1/modules/api-requests/api-request.entity';

const host = config.POSTGRES_CONTAINER || 'localhost';
const port = Number(config.POSTGRES_PORT) || 5432;
const username = config.POSTGRES_USERNAME || 'postgres';
const password = config.POSTGRES_PASSWORD || '123456';
const database = config.POSTGRES_DATABASE || 'stage-portfolio';

const isDevMode =
  config.NODE_ENV === NodeEnv.Development || config.NODE_ENV === NodeEnv.Test;

const entities = [
  User,
  Company,
  Domain,
  Request,
  Wheel,
  CompanyProductWheelMapping,
  Role,
  UserToken,
  UserLoginHistory,
  File,
  APIRequest,
];

export const AppDataSource = new DataSource({
  type: DbType.Postgres,
  host,
  port,
  username,
  password,
  database,
  entities: entities,
  synchronize: isDevMode,
  migrations: ['dist/migrations/*.js'],
  logging: false,
  namingStrategy: new DbNamingStrategy(),
});
