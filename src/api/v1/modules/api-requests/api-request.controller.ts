import { Request, Response } from 'express';
import { successResponse } from '../../helpers/success-response';
import { APIRequestService } from './api-request.service';
import { CompanyService } from '../company/company.service';
import { DomainService } from '../domain/domain.service';

export class APIRequestController {
  private readonly apiRequestService: APIRequestService =
    new APIRequestService();

  async requestList(req: Request, res: Response): Promise<Response | void> {
    const { sorting, ...rest } = req.query;
    const payload = { ...rest };

    if (sorting) {
      const parsedSorting = JSON.parse(req?.query?.sorting as string);
      payload.sorting = parsedSorting;
    }
    const { collection: requests, meta } =
      await this.apiRequestService.findRequestsAndCount(payload as any);

    successResponse({
      res,
      msg: 'succ-request-list',
      requests,
      meta,
    });
  }

  async getStatistics(req: Request, res: Response): Promise<Response | void> {
    const { from, to, company, domain } = req.query;

    const stats = await this.apiRequestService.getRequestStats({
      from: new Date(from as string),
      to: new Date(to as string),
      company: company ? Number(company) : undefined,
      domain: domain ? Number(domain) : undefined,
    });

    successResponse({
      res,
      msg: 'succ-api-request-stats',
      stats,
    });
  }

  async createRequest(req: Request, res: Response): Promise<Response | void> {
    const { data: newRequest } = await this.apiRequestService.createRequest(
      req.body
    );

    successResponse({
      res,
      msg: 'succ-create-api-request',
      request: { ...newRequest },
    });
  }
}
