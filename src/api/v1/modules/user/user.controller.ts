import { Request, Response } from 'express';
import { UserService } from './user.service';
import {
  conflictError,
  forbiddenError,
  notFoundError,
  unauthorizedError,
} from '../../errors';
import { successResponse } from '../../helpers/success-response';
import { User } from './user.entity';
import { RoleService } from '../role/role.service';
import { CompanyService } from '../company/company.service';
import { RoleType } from '../../middlewares/enums';

const commonExclude = [
  'password',
  'emailVerificationToken',
  'emailVerificationTokenCreatedAt',
  'resetPasswordTokenCreatedAt',
  'resetPasswordToken',
];

export class UserController {
  private readonly roleService: RoleService = new RoleService();
  private readonly userService: UserService = new UserService();
  private readonly companyService: CompanyService = new CompanyService();

  constructor() {
    this.userService = new UserService();
  }

  async userList(req: Request, res: Response): Promise<Response | void> {
    const { sorting, companyId, ...rest } = req.query;
    const payload = { ...rest };
    payload.id = req.user?.id as any;

    if (req.role?.name?.toLowerCase() === RoleType.BrandManager) {
      payload.companyId = req.user?.companyId as any;
    } else {
      payload.companyId = companyId;
    }
    if (sorting) {
      const parsedSorting = JSON.parse(req?.query?.sorting as string);
      payload.sorting = parsedSorting;
    }

    const { collection: users, meta } = await this.userService.findUserAndCount(
      payload as any
    );
    successResponse({
      res,
      msg: 'succ-user-list',
      meta,
      users,
    });
  }

  async companyUserList(req: Request, res: Response): Promise<Response | void> {
    const { sorting, companyId, ...rest } = req.query;
    const payload = { ...rest };
    payload.id = req.user?.id as any;

    if (sorting) {
      const parsedSorting = JSON.parse(req?.query?.sorting as string);
      payload.sorting = parsedSorting;
    }

    payload.companyId = companyId;

    const { collection: users, meta } =
      await this.userService.findCompanyAndCount(payload as any);
    successResponse({
      res,
      msg: 'succ-user-list',
      meta,
      users,
    });
  }
  async createUser(req: Request, res: Response): Promise<Response | void> {
    const { data: existingUser } = await this.userService.findOneUser({
      email: req.body.email,
    });
    if (existingUser) {
      conflictError(req.__('error-user-already-exist'));
    }

    const { data: user } = await this.userService.createUser(req.body);
    successResponse({
      res,
      msg: 'succ-create-user',
      user: { ...user },
    });
  }

  async currentUser(req: Request, res: Response): Promise<Response | void> {
    const { data: user } = await this.userService.findOneUser(
      {
        email: req.user?.email,
      },
      commonExclude
    );
    if (!user) {
      notFoundError(req.__('error-user-not-found'));
    }

    successResponse({
      res,
      msg: 'succ-current-user',
      user,
    });
  }

  async detailUser(req: Request, res: Response): Promise<Response | void> {
    const { data: user } = await this.userService.detailUser(
      { id: req.params.id },
      commonExclude
    );
    if (!user) {
      notFoundError(req.__('error-user-not-found'));
    }
    successResponse({
      res,
      msg: 'succ-detail-user',
      user,
    });
  }

  async updateUser(req: Request, res: Response): Promise<Response | void> {
    const { id } = req.params;
    const updateData: Partial<User> = req.body;

    const { data: user } = await this.userService.findOneUser(
      { id },
      commonExclude
    );
    if (!user) {
      notFoundError(req.__('error-user-not-found'));
    }
    if (
      req.user?.roleId !== 1 &&
      parseInt(req.params.id as string) !== req.user?.id
    ) {
      forbiddenError(req.__('error-permission-denied'));
    }

    if (updateData.role) {
      const { data: role } = await this.roleService.findOneRole({
        id: updateData.role,
      });
      if (!role) {
        notFoundError(req.__('error-role-not-found'));
      }
    }

    if (updateData.company) {
      const { data: company } = await this.companyService.findOneCompany({
        id: updateData.company,
      });
      if (!company) {
        notFoundError(req.__('error-company-not-found'));
      }
    }

    const updatedUserData: Partial<User> = {
      ...updateData,
    };

    const { data: updatedUser } = await this.userService.updateUser({
      instance: user as unknown as User,
      ...updatedUserData,
    });
    successResponse({
      res,
      msg: 'succ-update-user',
      user: updatedUser,
    });
  }

  async deleteUser(req: Request, res: Response): Promise<Response | void> {
    const { id } = req.params;
    const { data: user } = await this.userService.findOneUser({
      id,
    });
    if (!user) {
      notFoundError(req.__('error-user-not-found'));
    }

    await this.userService.deleteUser({ id });

    successResponse({
      res,
      msg: 'succ-user-delete',
    });
  }
}
