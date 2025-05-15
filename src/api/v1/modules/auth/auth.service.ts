import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { AppDataSource } from '../../../../config/postgresql.config';
import { PostgresqlService } from '../../services/postgresql/postgresql.service';
import { Query, sendEmail } from '../../helpers';
import { UserModel } from '../user/interface/user-model.interface';
import { hashPassword, timestampWithTimezone } from '../../utils';
import { ChangePassword, VerifyToken } from './interface';
import { UserService } from '../user/user.service';
import { JOB } from '../../../../config/constants';
import {
  changePasswordTemplate,
  forgotPasswordTokenTemplate,
  resendEmailVerificationTokenTemplate,
  resetPasswordTemplate,
  signupEmailTemplate,
} from '../../templates/auth';
import { UserLoginHistoryService } from '../histories/histories.service';
import { TokenType } from '../tokens/enum';
import { UserTokenService } from '../tokens/tokens.service';
import { v4 as uuidv4 } from 'uuid';

const commonExclude = [
  'password',
  'emailVerificationTokenCreatedAt',
  'resetPasswordTokenCreatedAt',
  'resetPasswordToken',
];

export class AuthService extends PostgresqlService {
  private readonly userRepository: Repository<User> =
    AppDataSource.getRepository(User);
  private readonly userService: UserService = new UserService();
  private readonly userTokenService: UserTokenService = new UserTokenService();
  private readonly userLoginHistoryService: UserLoginHistoryService =
    new UserLoginHistoryService();

  async findOneUser(queryKeys: Query, select?: string[]) {
    const user = await this.userService.findOneUser(queryKeys, select);
    return user;
  }

  async getUserCode(userId: number) {
    const result = await this.userTokenService.findOneUserToken({
      user: userId,
      type: TokenType.AccountVerification,
    });
    return result;
  }

  async createUser(payload: UserModel) {
    const userInput: Partial<UserModel> = { ...payload };
    const newUser = await this.create<User, UserModel>(
      this.userRepository,
      userInput,
      commonExclude
    );

    const tokenPayload = {
      user: newUser.data.id as number,
      type: TokenType.AccountVerification,
      expiredAt: timestampWithTimezone(
        new Date(new Date().getTime() + 5 * 60 * 1000)
      ),
      code: uuidv4(),
    };

    await this.userTokenService.createUserToken(tokenPayload);

    const template = signupEmailTemplate({
      firstName: newUser.data.firstName!,
      lastName: newUser.data.lastName!,
      email: newUser.data.email!,
      code: tokenPayload.code!,
    });
    sendEmail(JOB.SEND_EMAIL, { template });

    return newUser;
  }

  async lastLogin({ user, ip }: { user: UserModel; ip: string }) {
    const loginPayload = {
      user: user,
      ipAddress: ip,
    };
    await this.userLoginHistoryService.createUserLoginHistory(loginPayload);
  }
  async verifyEmail({ instance, user, token }: VerifyToken) {
    const result = await this.userTokenService.verifyUserToken({
      userId: user.id!,
      code: token,
      type: TokenType.AccountVerification,
    });

    if (result.data) {
      await this.userService.save<User, UserModel>(
        this.userRepository,
        instance,
        { isVerified: true }
      );
    }

    return result;
  }

  async generateVerifyToken(payload: UserModel) {
    const tokenPayload = {
      user: payload.id as number,
      type: TokenType.AccountVerification,
      expiredAt: timestampWithTimezone(
        new Date(new Date().getTime() + 5 * 60 * 1000)
      ),
      code: uuidv4(),
    };

    const token = await this.userTokenService.createUserToken(tokenPayload);

    const template = resendEmailVerificationTokenTemplate({
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      code: token.data.code!,
    });
    sendEmail(JOB.SEND_EMAIL, { template });
  }

  async forgotPassword(payload: UserModel) {
    const tokenPayload = {
      user: payload.id as number,
      type: TokenType.ResetPassword,
      expiredAt: timestampWithTimezone(
        new Date(new Date().getTime() + 5 * 60 * 1000)
      ),
      code: uuidv4(),
    };

    await this.userTokenService.createUserToken(tokenPayload);

    const template = forgotPasswordTokenTemplate({
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      code: tokenPayload.code!,
    });
    sendEmail(JOB.SEND_EMAIL, { template });
  }

  async resetPassword({ instance, user, token, password }: VerifyToken) {
    const result = await this.userTokenService.verifyUserToken({
      userId: user.id!,
      code: token,
      type: TokenType.ResetPassword,
    });

    if (result.data) {
      const hashedPassword = await hashPassword(password!);
      await this.userService.save<User, UserModel>(
        this.userRepository,
        instance,
        { password: hashedPassword }
      );
    }

    const template = resetPasswordTemplate({
      firstName: user.firstName!,
      lastName: user.lastName!,
      email: user.email!,
    });
    sendEmail(JOB.SEND_EMAIL, { template });

    return result;
  }

  async verifyResetPasswordToken({ instance, user, token }: VerifyToken) {
    const result = await this.userTokenService.verifyUserToken({
      userId: user.id!,
      code: token,
      type: TokenType.ResetPassword,
    });

    if (result.data) {
      return {
        data: result.data,
      };
    }

    return {
      error: 'error-invalid-token',
    };
  }

  async changePassword({ instance, password }: ChangePassword) {
    const hashedPassword = await hashPassword(password);
    const payload: Partial<UserModel> = { password: hashedPassword };
    const result = await this.save<User, UserModel>(
      this.userRepository,
      instance,
      payload
    );

    const template = changePasswordTemplate({
      firstName: result.data.firstName!,
      lastName: result.data.firstName!,
      email: result.data.email!,
    });
    console.log({
      to: template.to,
      subject: template.subject,
      hasHtml: !!template.html,
    });
    sendEmail(JOB.SEND_EMAIL, { template });
  }

  async updateUserPassword({ instance, password }: ChangePassword) {
    const hashedPassword = await hashPassword(password);
    const payload: Partial<UserModel> = { password: hashedPassword };
    await this.save<User, UserModel>(this.userRepository, instance, payload);
  }
}
