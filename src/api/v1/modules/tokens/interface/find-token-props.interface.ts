import { SortingOptions } from '../../../helpers/interfaces';
import { User } from '../../user/user.entity';

export interface FindUserLoginHistoryProps {
  q?: string;
  code?: string;
  type?: string;
  expiredAt?: string;
  userId?: number;
  isUsed?: boolean;
  page?: number;
  limit?: number;
  users?: User;
  sorting?: SortingOptions[];
}
