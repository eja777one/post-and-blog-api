import { Router, Request, Response } from "express";
import { authService } from '../domains/01.authService';
import { checkUsersRequest } from './../middlewares/checkUsersRequest';
import { checkCookie } from './../middlewares/checkCookieMware';
import { authMware } from '../middlewares/authMware';
import {
  checkReqBodyMware,
  testAddUserReqBody,
  testCodeReqBody,
  testEmailReqBody,
  testLoginPassReqBody,
  testReqRecoveryPass
} from '../middlewares/checkReqBodyMware';
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
import add from 'date-fns/add';

dotenv.config()

export const authRouter = Router({});

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

class AuthController {

  async login(req: Request<LoginInputModel>,
    res: Response<LoginSuccessViewModel>) {

    const ip = req.ip;

    const { loginOrEmail, password } = req.body;

    const deviceName = `${req.useragent?.browser} ${req.useragent?.version}`;

    const tokens = await authService
      .checkAuth(loginOrEmail, password, ip, deviceName);

    if (!tokens) return res.sendStatus(HTTP.UNAUTHORIZED_401);

    res.status(HTTP.OK_200)
      .cookie('refreshToken', tokens.refreshToken, {
        secure: process.env.NODE_ENV !== "cookie",
        httpOnly: true,
        expires: add(new Date(), { seconds: 20 }),
      })
      .json({ accessToken: tokens.accessToken });
  }

  async sendPassRecoveryCode(req: Request<PasswordRecoveryInputModel>,
    res: Response) {

    await authService.sendPasswordRecoveryCode(req.body.email);

    res.sendStatus(HTTP.NO_CONTENT_204);
  }

  async setNewPassword(req: Request<NewPasswordRecoveryInputModel>,
    res: Response) {

    const result = await authService.updatePassword
      (req.body.newPassword, req.body.recoveryCode);

    if (result) return res.sendStatus(HTTP.NO_CONTENT_204);
    else res.status(HTTP.BAD_REQUEST_400).json(recoveryCodeError);
  }

  async refreshTokens(req: Request, res: Response) {
    const tokens = await authService
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

    const result = await authService.confirmEmail(req.body.code);

    if (result) res.sendStatus(HTTP.NO_CONTENT_204);
    else res.status(HTTP.BAD_REQUEST_400).json(confirmCodeError);
  }

  async registration(req: Request<UserInputModel>, res: Response) {

    const userWasAdded = await authService.createUser(req.body, req.ip);

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

    const result = await authService.resendConfirmation(req.body.email);

    if (result) res.sendStatus(HTTP.NO_CONTENT_204);
    else res.status(HTTP.BAD_REQUEST_400).json(emailError);
  }

  async logout(req: Request, res: Response) {

    const refreshTokenWasRevoke = await authService
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

const authController = new AuthController();

authRouter.post('/login',
  checkUsersRequest,
  testLoginPassReqBody,
  checkReqBodyMware,
  authController.login);

authRouter.post('/password-recovery',
  checkUsersRequest,
  testEmailReqBody,
  checkReqBodyMware,
  authController.sendPassRecoveryCode);

authRouter.post('/new-password',
  checkUsersRequest,
  testReqRecoveryPass,
  checkReqBodyMware,
  authController.setNewPassword);

authRouter.post('/refresh-token',
  checkCookie,
  authController.refreshTokens);

authRouter.post('/registration-confirmation',
  checkUsersRequest,
  testCodeReqBody,
  checkReqBodyMware,
  authController.confirmEmail);

authRouter.post('/registration',
  checkUsersRequest,
  testAddUserReqBody,
  checkReqBodyMware,
  authController.registration);

authRouter.post('/registration-email-resending',
  checkUsersRequest,
  testEmailReqBody,
  checkReqBodyMware,
  authController.resendEmailConfirm);

authRouter.post('/logout',
  checkCookie,
  authController.logout);

authRouter.get('/me',
  authMware,
  authController.getMyInfo);