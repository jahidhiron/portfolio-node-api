import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import {
  badRequestError,
  conflictError,
  notFoundError,
  unauthorizedError,
} from '../../errors';
import { successResponse } from '../../helpers/success-response';
import { comparePassword, generateTokens, hashPassword } from '../../utils';
import { UserModel } from '../user/interface/user-model.interface';
import { User } from '../user/user.entity';
import { RoleService } from '../role/role.service';
import { RoleType } from '../../middlewares/enums';

export class AuthController {
  private readonly authService: AuthService = new AuthService();
  private readonly roleService: RoleService = new RoleService();

  async signup(req: Request, res: Response): Promise<Response | void> {
    const { email, role } = req.body;
    const { data: userExist } = await this.authService.findOneUser({ email });
    if (userExist) {
      conflictError(req.__('error-email-already-use'));
    }

    const { data: existingRole } = await this.roleService.findOneRole({
      name: role,
    });
    if (!existingRole) {
      notFoundError(req.__('error-role-not-found'));
    }

    const { data: user } = await this.authService.createUser({
      ...req.body,
      role: existingRole?.id,
    });

    /**
     * @todo
     * activity log
     */

    successResponse({
      res,
      msg: 'succ-signup',
      statusCode: 201,
      user,
    });
  }

  async signin(req: Request, res: Response): Promise<Response | void> {
    const { email, password } = req.body;

    const { data: user } = await this.authService.findOneUser({
      email,
    });

    if (!user) {
      unauthorizedError(req.__('error-user-not-found'));
    }

    // if (!user?.isVerified){
    //   unauthorizedError(req.__('error-email-not-verified'));
    // }

    const matchPassword = await comparePassword(user!.password, password);
    if (!matchPassword) {
      // await AuthService.authLimiter(req);
      unauthorizedError(req.__('error-invalid-credentials'));
    }

    const { firstName, lastName, id, isVerified, role, company } =
      user as UserModel;

    const { accessToken, refreshToken } = await generateTokens({
      firstName,
      lastName,
      id: id!,
      verified: isVerified,
      roleId: role.id!,
      email: user?.email!,
      companyId: company?.id!,
    });

    const { password: _, ...rest } = user as UserModel;

    await this.authService.lastLogin({ user: user!, ip: req.ip! });

    successResponse({
      res,
      msg: 'succ-signin',
      user: { ...rest },
      tokens: { accessToken, refreshToken },
    });
  }

  async verifyEmail(req: Request, res: Response): Promise<Response | void> {
    const { email, token } = req.body;

    const { data: userExist, instance } = await this.authService.findOneUser({
      email,
    });
    if (!userExist) {
      notFoundError(req.__('error-user-not-found'));
    }
    if (userExist!.isVerified) {
      conflictError(req.__('error-email-verified'));
    }

    const { data: tokenData } = await this.authService.verifyEmail({
      instance: instance as User,
      user: userExist as UserModel,
      token,
    });

    if (!tokenData) {
      badRequestError(req.__('error-invalid-token'));
    }

    /**
     * @todo
     * activity log
     */

    successResponse({
      res,
      msg: 'succ-verify-email',
    });
  }
  async verifyToken(req: Request, res: Response): Promise<Response | void> {
    const { email, token } = req.body;

    const { data: userExist, instance } = await this.authService.findOneUser({
      email,
    });
    if (!userExist) {
      notFoundError(req.__('error-user-not-found'));
    }

    const { data } = await this.authService.verifyEmail({
      instance: instance as User,
      user: userExist as UserModel,
      token,
    });

    if (!data) {
      badRequestError(req.__('error-invalid-token'));
    }

    /**
     * @todo
     * activity log
     */

    successResponse({
      res,
      msg: 'succ-verify-email',
    });
  }
  async verifyResetPasswordToken(
    req: Request,
    res: Response
  ): Promise<Response | void> {
    const { email, token } = req.body;

    const { data: userExist, instance } = await this.authService.findOneUser({
      email,
    });
    if (!userExist) {
      notFoundError(req.__('error-user-not-found'));
    }

    const { error } = await this.authService.verifyResetPasswordToken({
      instance: instance as User,
      user: userExist as UserModel,
      token,
    });

    if (error) {
      badRequestError(req.__(error));
    }

    /**
     * @todo
     * activity log
     */

    successResponse({
      res,
      msg: 'succ-verify-email',
    });
  }

  async resendEmailVerifyToken(
    req: Request,
    res: Response
  ): Promise<Response | void> {
    const { email } = req.body;

    const { data: userExist } = await this.authService.findOneUser({
      email,
    });
    if (!userExist) {
      notFoundError(req.__('error-user-not-found'));
    }

    if (userExist!.isVerified) {
      conflictError(req.__('error-email-verified'));
    }

    await this.authService.generateVerifyToken(userExist as UserModel);

    /**
     * @todo
     * activity log
     */

    successResponse({
      res,
      msg: 'succ-resend-email-verification-token',
    });
  }

  async generateRefreshToken(
    req: Request,
    res: Response
  ): Promise<Response | void> {
    const { accessToken, refreshToken } = await generateTokens(req?.user!);

    /**
     * @todo
     * activity log
     */

    successResponse({
      res,
      msg: 'succ-generate-refresh-token',
      tokens: { accessToken, refreshToken },
    });
  }

  async forgotPassword(req: Request, res: Response): Promise<Response | void> {
    const { email } = req.body;
    const { data: userExist, instance } = await this.authService.findOneUser({
      email,
    });
    if (!userExist) {
      notFoundError(req.__('error-user-not-found'));
    }

    await this.authService.forgotPassword(userExist as UserModel);

    successResponse({
      res,
      msg: 'succ-send-forgot-password-token',
    });
  }

  async resetPassword(req: Request, res: Response): Promise<Response | void> {
    const { email, token, password } = req.body;

    const { data: userExist, instance } = await this.authService.findOneUser({
      email,
    });
    if (!userExist) {
      notFoundError(req.__('error-user-not-found'));
    }

    const { data: tokenData } = await this.authService.resetPassword({
      instance: instance as User,
      user: userExist as UserModel,
      token,
      password,
    });

    if (!tokenData) {
      badRequestError(req.__('error-invalid-token'));
    }

    /**
     * @todo
     * activity log
     */

    successResponse({
      res,
      msg: 'succ-password-reset',
    });
  }

  async changePassword(req: Request, res: Response): Promise<Response | void> {
    const { oldPassword, newPassword } = req.body;

    const { data: userExist, instance } = await this.authService.findOneUser({
      email: req.user?.email,
    });
    if (!userExist) {
      notFoundError(req.__('error-user-not-found'));
    }

    const matchPassword = await comparePassword(
      userExist!.password,
      oldPassword
    );
    if (!matchPassword) {
      badRequestError(req.__('error-old-password-not-match'));
    }

    await this.authService.changePassword({
      instance: instance as User,
      password: newPassword,
    });

    /**
     * @todo
     * activity log
     */

    successResponse({
      res,
      msg: 'succ-change-password',
    });
  }

  async updatePassword(req: Request, res: Response): Promise<Response | void> {
    const { id } = req.params;
    const { password } = req.body;
    const { data: user } = await this.authService.findOneUser({ id });
    if (!user) {
      notFoundError(req.__('error-user-not-found'));
    }

    if (req.role?.name?.toLowerCase() === RoleType.BrandManager) {
      if (req.user?.companyId !== user?.company?.id) {
        unauthorizedError(req.__('error-unauthorized'));
      }
    }

    await this.authService.updateUserPassword({
      instance: user as unknown as User,
      password,
    });
    successResponse({
      res,
      msg: 'succ-update-user-password',
    });
  }

  async signout(req: Request, res: Response): Promise<Response | void> {
    /**
     * @todo
     * activity log
     */

    successResponse({
      res,
      msg: 'succ-signout',
    });
  }
}
