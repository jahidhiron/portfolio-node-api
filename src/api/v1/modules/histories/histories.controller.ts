import { Request, Response } from 'express';
import { successResponse } from '../../helpers/success-response';
import { UserLoginHistoryService } from './histories.service';
import { notFoundError } from '../../errors';

export class UserLoginHistoryController {
  private readonly userLoginTokenService: UserLoginHistoryService =
    new UserLoginHistoryService();

  constructor() {
    this.userLoginTokenService = new UserLoginHistoryService();
  }

  async userLoginHistoryList(
    req: Request,
    res: Response
  ): Promise<Response | void> {
    const { sorting, ...rest } = req.query;
    const payload = { ...rest };

    if (sorting) {
      const parsedSorting = JSON.parse(req?.query?.sorting as string);
      payload.sorting = parsedSorting;
    }

    const { collection: histories, meta } =
      await this.userLoginTokenService.LoginHistoryAndCountList(payload as any);
    successResponse({
      res,
      msg: 'succ-user-login-histories-list',
      meta,
      histories,
    });
  }

  async detailUserLoginHistory(
    req: Request,
    res: Response
  ): Promise<Response | void> {
    const { data: histories } =
      await this.userLoginTokenService.findOneUserLoginHistory(
        {
          id: req.params.id,
        }
        // commonExclude
      );
    if (!histories) {
      notFoundError(req.__('error-user-login-history-not-found'));
    }

    successResponse({
      res,
      msg: 'succ-detail-user-login-history',
      histories,
    });
  }

  async deleteUserLoginHistory(
    req: Request,
    res: Response
  ): Promise<Response | void> {
    const { id } = req.params;
    const { data: user } =
      await this.userLoginTokenService.findOneUserLoginHistory({
        id,
      });
    if (!user) {
      notFoundError(req.__('error-user-login-history-not-found'));
    }
    await this.userLoginTokenService.deleteUserLogin({ id });
    successResponse({
      res,
      msg: 'succ-user-login-history-delete',
    });
  }
}
