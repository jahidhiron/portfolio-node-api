import { Not, Repository } from 'typeorm';
import { APIRequest } from './api-request.entity';
import { AppDataSource } from '../../../../config/postgresql.config';
import { PostgresqlService } from '../../services/postgresql/postgresql.service';
import { Query } from '../../helpers';
import {
  FindRequestProps,
  APIRequestModel,
  APIRequestCreateModel,
} from './interface/index';
import { CustomQuery } from 'api/v1/helpers/interfaces';
import { APIRequest as APIRequestEntity } from './api-request.entity';

export class APIRequestService extends PostgresqlService {
  private readonly apiRequestRepository: Repository<APIRequest> =
    AppDataSource.getRepository(APIRequest);

  async createRequest(payload: APIRequestCreateModel) {
    const requestInput = {
      ...payload,
      company: { id: payload.company },
      domain: { id: payload.domain },
    };
    return this.create<APIRequest, APIRequestCreateModel>(
      this.apiRequestRepository,
      requestInput
    );
  }

  async findRequestsAndCount({
    q,
    status,
    page,
    limit,
    company,
    sorting,
    domain,
    from,
    to,
  }: FindRequestProps) {
    const queries: CustomQuery = [];

    if (q) {
      queries.push({
        query: `(LOWER(company.name) ILIKE :q OR LOWER(api_request.endpoint) ILIKE :q OR LOWER(api_request.parameters) ILIKE :q)`,
        q: `%${q?.toLowerCase() || ''}%`,
      });
    }

    if (status !== undefined) {
      queries.push({
        query: `api_request.status = :status`,
        status,
      });
    }

    if (company) {
      queries.push({
        query: `api_request.company = :company`,
        company,
      });
    }

    if (domain) {
      queries.push({
        query: `api_request.domain = :domain`,
        domain,
      });
    }
    if (from) {
      queries.push({
        query: `api_request."created_at" >= :from`,
        from: new Date(from),
      });
    }

    if (to) {
      queries.push({
        query: `api_request."created_at" <= :to`,
        to: new Date(to),
      });
    }

    const select = [
      'api_request.id',
      'api_request.endpoint',
      'api_request.parameters',
      'api_request.status',
      'api_request.createdAt',
      'company.id',
      'company.name',
      'company.logo',
      'company.isActive',
      'company.createdAt',
      'company.updatedAt',
      'domain.id',
      'domain.name',
      'domain.key',
      'domain.url',
      'domain.status',
      'domain.rfq_email',
    ];

    const relations = [
      { field: 'company', table: 'company' },
      { field: 'domain', table: 'domain' },
    ];

    return this.getManyAndCount<APIRequest, APIRequestModel>({
      repository: this.apiRequestRepository,
      entityName: 'api_request',
      queries,
      select,
      page,
      limit,
      sorting,
      relations,
    });
  }

  async getRequestStats({
    from,
    to,
    company,
    domain,
  }: {
    from: Date;
    to: Date;
    company?: number;
    domain?: number;
  }) {
    let query = this.apiRequestRepository
      .createQueryBuilder('request')
      .select(
        "TO_CHAR(DATE_TRUNC('day', request.createdAt), 'YYYY-MM-DD')",
        'date'
      )
      .addSelect('COUNT(*)', 'count')
      .where('request.createdAt >= :from AND request.createdAt <= :to', {
        from,
        to,
      });

    if (company) {
      query = query.andWhere('request.company_id = :company', { company });
    }

    if (domain) {
      query = query.andWhere('request.domain_id = :domain', { domain });
    }

    const rawData = await query
      .groupBy("DATE_TRUNC('day', request.createdAt)")
      .orderBy('date', 'ASC')
      .getRawMany();

    const dates: string[] = rawData.map((r) => r.date);
    const data: number[] = rawData.map((r) => parseInt(r.count));

    return [{ name: 'API Requests', dates, data }];
  }
}
