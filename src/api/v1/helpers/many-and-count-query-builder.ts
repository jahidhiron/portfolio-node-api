import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { ManyAndCountQueryBuilder } from './interfaces';

export const manyAndCountQueryBuilder = <T extends ObjectLiteral>({
  queryBuilder,
  entityName,
  queries,
  select,
  page,
  limit,
  sorting = [],
  relations,
}: ManyAndCountQueryBuilder<T>): SelectQueryBuilder<T> => {
  const take: number = limit;
  const skip: number = (page - 1) * take;

  relations.forEach(({ field, table }) => {
    queryBuilder = queryBuilder.leftJoinAndSelect(
      `${entityName}.${field}`,
      table
    );
  });

  for (const item of queries) {
    const values = Object.keys(item);

    if (values.length > 1) {
      queryBuilder.andWhere(item.query, { [values[1]]: item[values[1]] });
    }
  }

  queryBuilder.select(select);
  queryBuilder.skip(skip).take(take);

  // Validate and apply sorting
  if (Array.isArray(sorting)) {
    sorting.forEach((sortOption) => {
      if (
        sortOption &&
        typeof sortOption === 'object' &&
        sortOption.field &&
        sortOption.order
      ) {
        const { field, order } = sortOption;
        if (field.trim() !== '' && (order === 'ASC' || order === 'DESC')) {
          queryBuilder.addOrderBy(`${entityName}.${field}`, order);
        }
      }
    });
  }

  return queryBuilder;
};
