import { inject, injectable } from 'inversify';
import { Request, Response } from "express";
import { AuthService } from "../application/authService";
import add from 'date-fns/add';
import {
  LoginSuccessViewModel,
  MeViewModel,
  LoginInputModel,
  HTTP,
  RegistrationConfirmationCodeModel,
  UserInputModel,
  RegistrationEmailResending,
  PasswordRecoveryInputModel,
  NewPasswordRecoveryInputModel,
} from '../../../models';
import * as dotenv from 'dotenv';
dotenv.config()

@injectable()
export class AuthController {
  constructor(
    @inject(AuthService) protected authService: AuthService
  ) { }

  async registration(req: Request<UserInputModel>, res: Response) {
    const result = await this.authService.createUser(req.body, req.ip);
    res.status(result.statusCode).json(result.error);
  }

  async resendEmailConfirm(req: Request<RegistrationEmailResending>,
    res: Response) {
    const result = await this.authService.resendConfirmation(req.body.email);
    res.status(result.statusCode).json(result.error);
  }

  async confirmEmail(req: Request<RegistrationConfirmationCodeModel>,
    res: Response) {
    const result = await this.authService.confirmEmail(req.body.code);
    res.status(result.statusCode).json(result.error);
  }

  async login(req: Request<LoginInputModel>,
    res: Response<LoginSuccessViewModel>) {
    const ip = req.ip;
    const { loginOrEmail, password } = req.body;
    const deviceName = `${req.useragent?.browser} ${req.useragent?.version}`;

    const result = await this.authService
      .checkAuth(loginOrEmail, password, ip, deviceName);

    res.status(result.statusCode);

    if (result.data) {
      res.cookie('refreshToken', result.data.refreshToken, {
        secure: process.env.NODE_ENV !== "cookie",
        httpOnly: true,
        expires: add(new Date(), { minutes: 60 })
      })
        .json({ accessToken: result.data.accessToken });
    }
    res.send();
  }

  async refreshTokens(req: Request, res: Response) {
    const result = await this.authService
      .getNewTokensPair(req.cookies.refreshToken);

    res.status(result.statusCode);

    if (result.data) {
      res.cookie('refreshToken', result.data.refreshToken, {
        secure: process.env.NODE_ENV !== "cookie",
        httpOnly: true,
        expires: add(new Date(), { seconds: 20 }),
      })
        .json({ accessToken: result.data.accessToken });
    }

    res.send();
  }

  async logout(req: Request, res: Response) {
    const result = await this.authService
      .deleteRefreshToken(req.cookies.refreshToken);
    res.sendStatus(result.statusCode);
  }

  async getMyInfo(req: Request, res: Response<MeViewModel>) {
    if (!req.user) return res.sendStatus(HTTP.UNAUTHORIZED_401);
    res.status(HTTP.OK_200).json({
      email: req.user.email,
      login: req.user.login,
      userId: req.user.id
    });
  }

  async sendPassRecoveryCode(req: Request<PasswordRecoveryInputModel>,
    res: Response) {
    await this.authService.sendPasswordRecoveryCode(req.body.email);
    res.sendStatus(HTTP.NO_CONTENT_204);
  }

  async setNewPassword(req: Request<NewPasswordRecoveryInputModel>,
    res: Response) {
    const result = await this.authService.updatePassword
      (req.body.newPassword, req.body.recoveryCode);
    res.status(result.statusCode).json(result.error);
  }
};