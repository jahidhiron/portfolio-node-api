interface Error {
  message: string;
  field?: string;
  location?: string;
}

export interface CustomErrorResponse {
  name?: string;
  message: string;
  response: boolean;
  statusCode: number;
  errors: Error[];
}
