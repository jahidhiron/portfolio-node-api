interface Meta {
  total: number;
  pages: number;
}

export interface GetManyAndCountResult<K> {
  collection: K[];
  meta: Meta;
}
