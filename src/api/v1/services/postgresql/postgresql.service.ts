import {
  DeepPartial,
  ObjectLiteral,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { queryBuilder, Query } from '../../helpers';
import { instanceToPlain } from 'class-transformer';
import { filterObject, shallowMerge } from '../../utils';
import { manyAndCountQueryBuilder } from '../../helpers/many-and-count-query-builder';
import { GetManyAndCount, GetManyAndCountResult } from './interfaces';

export class PostgresqlService {
  async findOne<T extends ObjectLiteral, K>(
    repository: Repository<T>,
    queryKeys: Query = {},
    exclude: string[] = [],
    select: string[] = [],
    relations: string[] = []
  ): Promise<{ instance: T | null; data: K | null }> {
    const query = queryBuilder(queryKeys, select, relations);

    const instance = await repository.findOne(query);
    let data = null;

    if (instance) {
      data = instanceToPlain(instance) as K;
    }

    if (data) {
      data = filterObject(data, exclude) as K;
    }

    if (!instance) return { instance: null, data: null };
    return { instance, data };
  }
  async find<T extends ObjectLiteral, K>(
    repository: Repository<T>,
    queryKeys: Query = {},
    select: string[] = [],
    relations: string[] = []
  ): Promise<{ collection: T[] | null; data: K[] | null }> {
    const query = queryBuilder(queryKeys, select, relations);
    const collection = await repository.find(query);
    const data = instanceToPlain<T>(collection) as K[];
    return { collection, data };
  }

  async getManyAndCount<T extends ObjectLiteral, K>({
    repository,
    entityName,
    queries = [],
    limit = 10,
    page = 1,
    select = [],
    sorting = [],
    relations = [],
  }: GetManyAndCount<T>): Promise<GetManyAndCountResult<K>> {
    let queryBuilder: SelectQueryBuilder<T> =
      repository.createQueryBuilder(entityName);

    queryBuilder = manyAndCountQueryBuilder({
      queryBuilder,
      entityName,
      queries,
      limit,
      page,
      select,
      sorting,
      relations,
    });

    const [collection, total]: [T[], number] =
      await queryBuilder.getManyAndCount();

    const plainCollection = instanceToPlain<T>(collection) as K[];
    const meta = { total, pages: Math.ceil(total / limit) };

    return { collection: plainCollection, meta };
  }

  async create<T extends ObjectLiteral, K extends Record<string, any>>(
    repository: Repository<T>,

    payload: DeepPartial<T>,
    exclude: string[] = []
  ): Promise<{ instance: T; data: Partial<K> }> {
    const newInstance = repository.create(payload);
    const instance = await repository.save(newInstance);
    const newData = instanceToPlain(instance) as K;
    const data = filterObject<K>(newData, exclude);
    return { instance, data };
  }

  async save<T extends ObjectLiteral, K extends Record<string, any>>(
    repository: Repository<T>,
    instance: T,
    payload: Partial<K>,
    exclude: string[] = []
  ): Promise<{ instance: T; data: Partial<K> }> {
    const mergeInstance = shallowMerge<T>(instance, payload as DeepPartial<T>);
    const updatedInstance = await repository.save(mergeInstance);
    const updatedData = instanceToPlain(updatedInstance) as K;
    const data = filterObject<K>(updatedData, exclude);
    return { instance: updatedInstance, data };
  }

  async delete<T extends ObjectLiteral>(
    repository: Repository<T>,
    query: Query
  ): Promise<number | null | undefined> {
    const result = await repository.delete(query);
    return result.affected;
  }
}
