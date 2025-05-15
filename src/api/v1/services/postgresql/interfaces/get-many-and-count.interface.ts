import { ObjectLiteral, Repository } from 'typeorm';
import { CustomQuery, SortingOptions } from '../../../helpers/interfaces';
import { Relations } from './relations.interface';

export interface GetManyAndCount<T extends ObjectLiteral> {
  repository: Repository<T>;
  entityName: string;
  queries?: CustomQuery;
  select?: string[];
  page?: number;
  limit?: number;
  sorting?: SortingOptions[];
  relations?: Relations;
}
