import { MoreThan, Repository } from 'typeorm';
import { AppDataSource } from '../../../../config/postgresql.config';
import { Query } from '../../helpers';
import { PostgresqlService } from '../../services/postgresql/postgresql.service';
import { UserToken } from './tokens.entity';
import {
  FindUserLoginHistoryProps,
  TokenPayload,
  UserTokenModel,
} from './interface';
import { VerifyTokenPayload } from './interface/verify-email.interface';
import { CustomQuery } from '../../helpers/interfaces';
import { TokenType } from './enum';

export class UserTokenService extends PostgresqlService {
  private readonly userTokenRepository: Repository<UserToken> =
    AppDataSource.getRepository(UserToken);

  async userTokenAndCountList({
    q,
    page,
    limit,
    sorting,
  }: FindUserLoginHistoryProps) {
    const queries: CustomQuery = [];

    if (q) {
      queries.push({
        query: `users.email ILIKE :q`,
        q: `%${q}%`,
      });
    }
    const select = [
      'user_tokens.id',
      'user_tokens.code',
      'user_tokens.type',
      'user_tokens.isUsed',
      'user_tokens.expiredAt',
      'user_tokens.createdAt',
    ];

    const relations = [{ field: 'user', table: 'users' }];
    const result = await this.getManyAndCount<UserToken, UserTokenModel>({
      repository: this.userTokenRepository,
      entityName: 'user_tokens',
      queries,
      select,
      page,
      limit,
      sorting,
      relations,
    });

    return result;
  }

  async createUserToken(payload: TokenPayload) {
    const userInput: Partial<UserToken> = { ...payload };
    return this.create<UserToken, UserTokenModel>(
      this.userTokenRepository,
      userInput
    );
  }

  async findOneUserToken({ user, type }: { user: number; type: TokenType }) {
    const token = await this.userTokenRepository
      .createQueryBuilder('user_tokens')
      .where('user_tokens.user_id = :userId', { userId: user })
      .andWhere('user_tokens.type = :type', { type })
      .getOne();

    return {
      data: token,
      instance: token,
    };
  }

  async verifyUserToken(payload: VerifyTokenPayload) {
    const { data: tokenData, instance } = await this.findOne<
      UserToken,
      UserTokenModel
    >(this.userTokenRepository, {
      code: payload.code,
      user: payload.userId,
      type: payload.type,
    });

    if (!tokenData || !instance) {
      return { instance: null, data: null };
    }

    return this.save<UserToken, UserTokenModel>(
      this.userTokenRepository,
      instance,
      { isUsed: true }
    );
  }

  async deleteUserToekn(query: Query) {
    return this.delete<UserToken>(this.userTokenRepository, query);
  }
}
