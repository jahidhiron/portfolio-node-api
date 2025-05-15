import { SortingOptions } from '../../../helpers/interfaces';

export interface FindUserLoginHistoryProps {
  q: string;
  isVerified: boolean;
  page: number;
  limit: number;
  sorting: SortingOptions[];
}
