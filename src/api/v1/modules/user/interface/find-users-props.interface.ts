import { SortingOptions } from '../../../helpers/interfaces';
import { Role } from '../../role/role.entity';

export interface FindUserProps {
  q: string;
  isVerified: boolean;
  isActive: boolean;
  role: Role | string;
  page: number;
  companyId: number;
  id: number;
  limit: number;
  sorting: SortingOptions[];
}
