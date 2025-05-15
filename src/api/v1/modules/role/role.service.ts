import { Repository } from 'typeorm';
import { Role } from './role.entity';
import { AppDataSource } from '../../../../config/postgresql.config';
import { PostgresqlService } from '../../services/postgresql/postgresql.service';
import { Query } from '../../helpers';
import { ChangeRole, RoleModel, FindRoleProps } from './interface';
import { CustomQuery } from 'api/v1/helpers/interfaces';
import { UserModel } from '../user/interface';

export class RoleService extends PostgresqlService {
  private readonly roleRepository: Repository<Role> =
    AppDataSource.getRepository(Role);

  async findOneRole(queryKeys: Query, exclude?: string[], select?: string[]) {
    return this.findOne<Role, RoleModel>(
      this.roleRepository,
      queryKeys,
      exclude,
      select
    );
  }

  async detailRole(queryKeys: Query, exclude?: string[], select?: string[]) {
    const role = await this.findOne<Role, RoleModel>(
      this.roleRepository,
      queryKeys,
      exclude,
      select
    );
    return role;
  }

  async createRole(payload: RoleModel) {
    const roleInput: Partial<RoleModel> = { ...payload };
    return this.create<Role, RoleModel>(this.roleRepository, roleInput);
  }

  async findRoleList({ q, page, limit, sorting }: FindRoleProps) {
    const queries: CustomQuery = [];

    if (q) {
      queries.push({
        query: `LOWER(role.name) ILIKE :q`,
        q: `%${q?.toLowerCase() || ''}%`,
      });
    }
    const select = [
      'role.id',
      'role.name',
      'role.description',
      'role.createdAt',
      'role.updatedAt',
    ];
    return this.getManyAndCount<Role, RoleModel>({
      repository: this.roleRepository,
      entityName: 'role',
      queries,
      select,
      page,
      limit,
      sorting,
    });
  }

  async updateRole({ instance, ...rest }: ChangeRole) {
    return this.save<Role, RoleModel>(this.roleRepository, instance, rest);
  }

  async deleteRole(query: Query) {
    return this.delete<Role>(this.roleRepository, query);
  }
}
