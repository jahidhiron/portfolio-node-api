import { SortingOptions } from '../../../helpers/interfaces';
import { User } from '../../user/user.entity';

export interface FindRoleProps {
  q?: string;
  page: number;
  limit: number;
  users?: User;
  sorting: SortingOptions[];
}
