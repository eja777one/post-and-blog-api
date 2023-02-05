import { Request, Response } from "express";
import { AuthService } from "../domains/01.authService";
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
  NewPasswordRecoveryInputModel
} from '../models';
import * as dotenv from 'dotenv';
dotenv.config()

const recoveryCodeError = {
  errorsMessages: [{ message: 'incorrect recoveryCode', field: 'recoveryCode' }]
};

const confirmCodeError = {
  errorsMessages: [{ message: 'incorrect code', field: 'code' }]
};

const emailError = {
  errorsMessages: [{ message: 'incorrect email', field: 'email' }]
};

const loginIsExistError = {
  errorsMessages: [{ message: 'incorrect login', field: 'login' }]
};


export class AuthController {
  constructor(protected authService: AuthService) { }

  async login(req: Request<LoginInputModel>,
    res: Response<LoginSuccessViewModel>) {

    const ip = req.ip;

    const { loginOrEmail, password } = req.body;

    const deviceName = `${req.useragent?.browser} ${req.useragent?.version}`;

    const tokens = await this.authService
      .checkAuth(loginOrEmail, password, ip, deviceName);

    if (!tokens) return res.sendStatus(HTTP.UNAUTHORIZED_401);

    res.status(HTTP.OK_200)
      .cookie('refreshToken', tokens.refreshToken, {
        secure: process.env.NODE_ENV !== "cookie",
        httpOnly: true,
        expires: add(new Date(), { minutes: 60 }),
      })
      .json({ accessToken: tokens.accessToken });
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

    if (result) return res.sendStatus(HTTP.NO_CONTENT_204);
    else res.status(HTTP.BAD_REQUEST_400).json(recoveryCodeError);
  }

  async refreshTokens(req: Request, res: Response) {
    const tokens = await this.authService
      .getNewTokensPair(req.cookies.refreshToken);

    if (!tokens) return res.sendStatus(HTTP.UNAUTHORIZED_401);

    res.status(HTTP.OK_200)
      .cookie('refreshToken', tokens.newRefreshToken, {
        secure: process.env.NODE_ENV !== "cookie",
        httpOnly: true,
        expires: add(new Date(), { seconds: 20 }),
      })
      .json({ accessToken: tokens.newAccessToken });
  }

  async confirmEmail(req: Request<RegistrationConfirmationCodeModel>,
    res: Response) {

    const result = await this.authService.confirmEmail(req.body.code);

    if (result) res.sendStatus(HTTP.NO_CONTENT_204);
    else res.status(HTTP.BAD_REQUEST_400).json(confirmCodeError);
  }

  async registration(req: Request<UserInputModel>, res: Response) {

    const userWasAdded = await this.authService.createUser(req.body, req.ip);

    if (!userWasAdded || userWasAdded === 'emailIsExist') {
      return res.status(HTTP.BAD_REQUEST_400).json(emailError);
    };

    if (userWasAdded === 'loginIsExist') {
      return res.status(HTTP.BAD_REQUEST_400).json(loginIsExistError);
    };

    return res.sendStatus(HTTP.NO_CONTENT_204);
  }

  async resendEmailConfirm(req: Request<RegistrationEmailResending>,
    res: Response) {

    const result = await this.authService.resendConfirmation(req.body.email);

    if (result) res.sendStatus(HTTP.NO_CONTENT_204);
    else res.status(HTTP.BAD_REQUEST_400).json(emailError);
  }

  async logout(req: Request, res: Response) {

    const refreshTokenWasRevoke = await this.authService
      .deleteRefreshToken(req.cookies.refreshToken);

    if (refreshTokenWasRevoke) return res.sendStatus(HTTP.NO_CONTENT_204);

    res.sendStatus(HTTP.UNAUTHORIZED_401);
  }

  async getMyInfo(req: Request, res: Response<MeViewModel>) {

    if (!req.user) return res.sendStatus(HTTP.UNAUTHORIZED_401);

    const user = {
      email: req.user.email,
      login: req.user.login,
      userId: req.user.id
    };

    res.status(HTTP.OK_200).json(user);
  }
};