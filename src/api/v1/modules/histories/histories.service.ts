import { Repository } from 'typeorm';
import { AppDataSource } from '../../../../config/postgresql.config';
import { Query } from '../../helpers';
import { PostgresqlService } from '../../services/postgresql/postgresql.service';
import { UserLoginHistoryModel } from './interface';
import { timestampWithTimezone } from '../../utils';
import { UserLoginHistory } from './histories.entity';
import { CustomQuery } from '../../helpers/interfaces';
import { FindUserLoginHistoryProps } from './interface/find-histories.interface';
import { ChangeUserLoginHistory } from './interface/change-histories.interface';

export class UserLoginHistoryService extends PostgresqlService {
  private readonly userLoginHistoryRepository: Repository<UserLoginHistory> =
    AppDataSource.getRepository(UserLoginHistory);

  async LoginHistoryAndCountList({
    q,
    isVerified,
    page,
    limit,
    sorting,
  }: FindUserLoginHistoryProps) {
    const queries: CustomQuery = [];

    if (q) {
      queries.push({
        query: `(users.firstName || ' ' || users.lastName) ILIKE :q OR users.email ILIKE :q`,
        q: `%${q}%`,
      });
    }

    if (isVerified !== undefined) {
      queries.push({
        query: `users.isVerified = :isVerified`,
        isVerified,
      });
    }

    const select = [
      'user_login_histories.id',
      'user_login_histories.ipAddress',
      'user_login_histories.loginAt',
      'users.id',
      'users.email',
      'users.role',
      'users.firstName',
      'users.lastName',
      'users.isVerified',
    ];

    const relations = [{ field: 'user', table: 'users' }];

    const result = await this.getManyAndCount<
      UserLoginHistory,
      UserLoginHistoryModel
    >({
      repository: this.userLoginHistoryRepository,
      entityName: 'user_login_histories',
      queries,
      select,
      page,
      limit,
      sorting,
      relations,
    });

    return result;
  }

  async findOneUserLoginHistory(queryKeys: Query) {
    const relations = ['user', 'user.company'];
    const exclude = ['user.password'];
    return this.findOne<UserLoginHistory, UserLoginHistoryModel>(
      this.userLoginHistoryRepository,
      queryKeys,
      exclude,
      [],
      relations
    );
  }

  async createUserLoginHistory(payload: UserLoginHistoryModel) {
    const createdAt = timestampWithTimezone();
    const loginInput = {
      user: payload.user.id,
      loginAt: createdAt,
      ipAddress: payload.ipAddress,
    };

    return this.create<UserLoginHistory, UserLoginHistoryModel>(
      this.userLoginHistoryRepository,
      loginInput as Partial<UserLoginHistory>
    );
  }

  async deleteUserLogin(query: Query) {
    return this.delete<UserLoginHistory>(
      this.userLoginHistoryRepository,
      query
    );
  }
}
