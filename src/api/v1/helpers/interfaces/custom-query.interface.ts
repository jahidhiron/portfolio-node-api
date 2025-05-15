interface Query {
  query: string;
  [key: string]: any;
}

export type CustomQuery = Query[];
