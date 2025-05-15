import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { CustomQuery } from './custom-query.interface';
import { SortingOptions } from './sorting-options.interface';
import { Relations } from 'api/v1/services/postgresql/interfaces/relations.interface';

export interface ManyAndCountQueryBuilder<T extends ObjectLiteral> {
  queryBuilder: SelectQueryBuilder<T>;
  entityName: string;
  queries: CustomQuery;
  select: string[];
  page: number;
  limit: number;
  sorting: SortingOptions[];
  relations: Relations;
}
