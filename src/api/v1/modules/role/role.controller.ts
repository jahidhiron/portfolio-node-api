import { Request, Response } from 'express';
import { successResponse } from '../../helpers/success-response';
import { notFoundError, conflictError, badRequestError } from '../../errors';
import { Role } from './role.entity';
import { RoleService } from './role.service';
import { UserService } from '../user/user.service';

const commonExclude = ['users.password', 'password', 'user.password'];

export class RoleController {
  private readonly roleService: RoleService = new RoleService();
  private readonly userService: UserService = new UserService();

  async roleList(req: Request, res: Response): Promise<Response | void> {
    const { sorting, ...rest } = req.query;
    const payload = { ...rest };

    if (sorting) {
      const parsedSorting = JSON.parse(req?.query?.sorting as string);
      payload.sorting = parsedSorting;
    }
    const { collection: roles, meta } = await this.roleService.findRoleList(
      payload as any
    );

    successResponse({
      res,
      msg: 'succ-role-list',
      roles,
      meta,
    });
  }

  async detailRole(req: Request, res: Response): Promise<Response | void> {
    const { id } = req.params;

    const { data: role } = await this.roleService.detailRole(
      { id },
      commonExclude
    );
    if (!role) {
      notFoundError(req.__('error-role-not-found'));
    }

    successResponse({
      res,
      msg: 'succ-detail-role',
      role,
    });
  }

  async createRole(req: Request, res: Response): Promise<Response | void> {
    const { name } = req.body;

    const { data: existingRole } = await this.roleService.findOneRole({ name });
    if (existingRole) {
      conflictError(req.__('error-role-already-exists'));
    }

    const { data: newRole } = await this.roleService.createRole(req.body);

    successResponse({
      res,
      msg: 'succ-create-role',
      role: { ...newRole },
    });
  }

  async updateRole(req: Request, res: Response): Promise<Response | void> {
    const { id } = req.params;
    const updateData: Partial<Role> = req.body;

    const { data: role } = await this.roleService.findOneRole({ id });
    if (!role) {
      notFoundError(req.__('error-role-not-found'));
    }

    if (updateData.name) {
      const { data: existingRole } = await this.roleService.findOneRole({
        name: updateData.name,
      });
      if (existingRole && existingRole.id !== Number(id)) {
        conflictError(req.__('error-role-name-exists'));
      }
    }

    const { data: updatedRole } = await this.roleService.updateRole({
      instance: role as unknown as Role,
      ...updateData,
    });

    successResponse({
      res,
      msg: 'succ-update-role',
      role: updatedRole,
    });
  }

  async deleteRole(req: Request, res: Response): Promise<Response | void> {
    const { id } = req.params;

    const { data: user } = await this.userService.findOneUser({
      role: parseInt(id),
    });
    if (user) {
      badRequestError(req.__('error-user-exist-under-this-role'));
    }

    const { data: role } = await this.roleService.findOneRole({ id });
    if (!role) {
      notFoundError(req.__('error-role-not-found'));
    }

    await this.roleService.deleteRole({ id });

    successResponse({
      res,
      msg: 'succ-delete-role',
    });
  }
}
