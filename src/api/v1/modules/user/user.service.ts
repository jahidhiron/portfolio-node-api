import { Not, Repository } from 'typeorm';
import { User } from './user.entity';
import { AppDataSource } from '../../../../config/postgresql.config';
import { Query } from '../../helpers';
import { PostgresqlService } from '../../services/postgresql/postgresql.service';
import { ChangeProfile } from '../auth/interface';
import { CustomQuery } from '../../helpers/interfaces';
import { FindUserProps, UserModel } from './interface';
export class UserService extends PostgresqlService {
  private readonly userRepository: Repository<User> =
    AppDataSource.getRepository(User);

  async createUser(payload: UserModel) {
    const userInput: Partial<UserModel> = { ...payload };
    return this.create<User, UserModel>(this.userRepository, userInput);
  }

  async findOneUser(queryKeys: Query, select?: string[]) {
    const relations = ['role', 'company'];

    return this.findOne<User, UserModel>(
      this.userRepository,
      queryKeys,
      select,
      [],
      relations
    );
  }

  async detailUser(queryKeys: Query, exclude?: string[], select?: string[]) {
    const relations = ['role', 'company'];

    return this.findOne<User, UserModel>(
      this.userRepository,
      queryKeys,
      exclude,
      select,
      relations
    );
  }

  async findUserAndCount({
    q,
    isVerified,
    isActive,
    role,
    page,
    limit,
    companyId,
    id,
    sorting: sortings,
  }: FindUserProps) {
    const queries: CustomQuery = [];

    if (q) {
      queries.push({
        query: `(LOWER(user.email) ILIKE :q OR LOWER(user.firstName) ILIKE :q OR LOWER(user.lastName) ILIKE :q)`,
        q: `%${q.toLowerCase()}%`,
      });
    }

    // Only apply company and role filters if the requesting user is not an admin
    if (role !== '1') {
      if (companyId !== undefined) {
        queries.push({
          query: `user.company = :companyId`,
          companyId,
        });
      }

      if (role) {
        queries.push({
          query: `user.role = :role`,
          role,
        });
      }
    }

    if (isVerified !== undefined) {
      queries.push({
        query: `user.isVerified = :isVerified`,
        isVerified,
      });
    }
    if (isActive !== undefined) {
      queries.push({
        query: `user.isActive = :isActive`,
        isActive,
      });
    }

    const select = [
      'user.id',
      'user.firstName',
      'user.lastName',
      'user.email',
      'user.isVerified',
      'user.role',
      'user.createdAt',
      'user.updatedAt',
      'user.isActive',
      'role.id',
      'role.name',
      'company.id',
      'company.name',
      'company.managedBy',
      'company.logo',
    ];

    const relations = [
      { field: 'role', table: 'role' },
      { field: 'company', table: 'company' },
    ];

    const sorting = sortings ?? [{ field: 'id', order: 'DESC' }];

    return this.getManyAndCount<User, UserModel>({
      repository: this.userRepository,
      entityName: 'user',
      queries,
      select,
      page,
      limit,
      sorting,
      relations,
    });
  }

  async findCompanyAndCount({
    q,
    isVerified,
    isActive,
    role,
    page,
    limit,
    companyId,
    id,
    sorting: sortings,
  }: FindUserProps) {
    const queries: CustomQuery = [];

    if (companyId !== undefined) {
      queries.push({
        query: `user.company = :companyId`,
        companyId,
      });
    }

    const select = [
      'user.id',
      'user.firstName',
      'user.lastName',
      'user.email',
      'user.isVerified',
      'user.role',
      'user.createdAt',
      'user.updatedAt',
      'user.isActive',
      'role.id',
      'role.name',
      'company.id',
      'company.name',
      'company.managedBy',
      'company.logo',
    ];

    const relations = [
      { field: 'role', table: 'role' },
      { field: 'company', table: 'company' },
    ];

    const sorting = sortings ?? [{ field: 'id', order: 'DESC' }];

    return this.getManyAndCount<User, UserModel>({
      repository: this.userRepository,
      entityName: 'user',
      queries,
      select,
      page,
      limit,
      sorting,
      relations,
    });
  }

  async updateUser({ instance, password: _password, ...rest }: ChangeProfile) {
    return this.save<User, UserModel>(this.userRepository, instance, rest);
  }

  async deleteUser(query: Query) {
    return this.delete<User>(this.userRepository, query);
  }
}
