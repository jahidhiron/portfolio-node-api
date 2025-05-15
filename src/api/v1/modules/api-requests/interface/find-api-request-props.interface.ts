import { SortingOptions } from 'api/v1/helpers/interfaces';
import { Company } from '../../company/company.entity';
import { Domain } from '../../domain/domain.entity';

export interface FindRequestProps {
  q?: string;
  status?: boolean;
  page?: number;
  limit?: number;
  sorting?: SortingOptions[];
  company?: number;
  domain?: number;
  from?: string;
  to?: string;
}
