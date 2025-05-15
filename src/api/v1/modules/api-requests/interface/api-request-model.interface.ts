import { CompanyModel } from '../../company/interface';
import { DomainModel } from '../../domain/interface';
import { SortingOptions } from '../../../helpers/interfaces';

export interface APIRequestModel {
  id?: number;

  endpoint: string;
  parameters: string;

  company: CompanyModel;
  domain: DomainModel;

  status: boolean;
  createdAt: Date;
}

export interface APIRequestCreateModel {
  endpoint: string;
  parameters: string;
  company: number;
  domain: number;
  status: boolean;
  createdAt: Date;
}
