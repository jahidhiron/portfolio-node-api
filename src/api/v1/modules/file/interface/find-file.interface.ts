import { SortingOptions } from '../../../helpers/interfaces';

export interface FindFileProps {
  id?: number;
  path?: string;
  page: number;
  limit: number;
  sorting: SortingOptions[];
}
