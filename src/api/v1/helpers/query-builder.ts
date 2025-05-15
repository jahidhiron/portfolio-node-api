export type Query = Record<string, any>;
export type QueryOptions = Record<string, any>;

export const queryBuilder = (
  queryKeys: Query = {},
  select: string[] = [],
  relations: string[] = []
): Record<string, any> => {
  const query: Record<string, any> = { where: queryKeys };
  query.select = select;
  query.relations = relations;
  return query;
};
