import { Router, Request, Response } from "express";
import { authServices } from '../domains/01.authServices';
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

const recoveryCodeError = {
  errorsMessages: [{
    message: 'incorrect recoveryCode',
    field: 'recoveryCode'
  }]
};

const confirmCodeError = {
  errorsMessages: [{
    message: 'incorrect code',
    field: 'code'
  }]
};

const emailError = {
  errorsMessages: [{
    message: 'incorrect email',
    field: 'email'
  }]
};

const loginIsExistError = {
  errorsMessages: [{
    message: 'incorrect login',
    field: 'login'
  }]
};


export const authRouter = Router({});

authRouter.post('/login',
  checkUsersRequest,
  testLoginPassReqBody,
  checkReqBodyMware,
  async (req: Request<LoginInputModel>,
    res: Response<LoginSuccessViewModel>) => {

    const ip = req.ip;

    const { loginOrEmail, password } = req.body;

    const deviceName =
      `${req.useragent?.browser} ${req.useragent?.version}`;

    const tokens = await authServices
      .checkAuth(loginOrEmail, password, ip, deviceName);

    if (!tokens) {
      return res.sendStatus(HTTP.UNAUTHORIZED_401);
    };

    res.status(HTTP.OK_200)
      .cookie('refreshToken', tokens.refreshToken, {
        secure: process.env.NODE_ENV !== "cookie",
        httpOnly: true,
        expires: add(new Date(), { seconds: 20 }),
      })
      .json({ accessToken: tokens.accessToken });

  });

authRouter.post('/password-recovery',
  checkUsersRequest,
  testEmailReqBody,
  checkReqBodyMware,
  async (req: Request<PasswordRecoveryInputModel>,
    res: Response) => {

    await authServices
      .sendPasswordRecoveryCode(req.body.email);

    res.sendStatus(HTTP.NO_CONTENT_204);
  });

authRouter.post('/new-password',
  checkUsersRequest,
  testReqRecoveryPass,
  checkReqBodyMware,
  async (req: Request<NewPasswordRecoveryInputModel>,
    res: Response) => {

    const result = await authServices.updatePassword
      (req.body.newPassword, req.body.recoveryCode);

    if (result) {
      return res.sendStatus(HTTP.NO_CONTENT_204);
    } else {
      res.status(HTTP.BAD_REQUEST_400)
        .json(recoveryCodeError);
    };
  });

authRouter.post('/refresh-token',
  checkCookie,
  async (req: Request, res: Response) => {
    const tokens = await authServices
      .getNewTokensPair(req.cookies.refreshToken);

    if (tokens) {
      res.status(HTTP.OK_200)
        .cookie('refreshToken', tokens.newRefreshToken, {
          secure: process.env.NODE_ENV !== "cookie",
          httpOnly: true,
          expires: add(new Date(), { seconds: 20 }),
        })
        .json({ accessToken: tokens.newAccessToken });
    } else res.sendStatus(HTTP.UNAUTHORIZED_401);
  });

authRouter.post('/registration-confirmation',
  checkUsersRequest,
  testCodeReqBody,
  checkReqBodyMware,
  async (req: Request<RegistrationConfirmationCodeModel>,
    res: Response) => {

    const result = await authServices.confirmEmail(req.body.code);

    if (result) {
      res.sendStatus(HTTP.NO_CONTENT_204);
    } else {
      res.status(HTTP.BAD_REQUEST_400)
        .json(confirmCodeError);
    };
  });

authRouter.post('/registration',
  checkUsersRequest,
  testAddUserReqBody,
  checkReqBodyMware,
  async (req: Request<UserInputModel>,
    res: Response) => {

    const userWasAdded = await authServices
      .createUser(req.body, req.ip);

    if (!userWasAdded || userWasAdded === 'emailIsExist') {
      return res.status(HTTP.BAD_REQUEST_400)
        .json(emailError);
    } else if (userWasAdded === 'loginIsExist') {
      return res.status(HTTP.BAD_REQUEST_400)
        .json(loginIsExistError);
    } else {
      return res.sendStatus(HTTP.NO_CONTENT_204);
    };
  });

authRouter.post('/registration-email-resending',
  checkUsersRequest,
  testEmailReqBody,
  checkReqBodyMware,
  async (req: Request<RegistrationEmailResending>,
    res: Response) => {

    const result = await authServices
      .resendConfirmation(req.body.email);

    if (result) res.sendStatus(HTTP.NO_CONTENT_204);
    else res.status(HTTP.BAD_REQUEST_400).json(emailError);
  });

authRouter.post('/logout',
  checkCookie,
  async (req: Request, res: Response) => {

    const refreshTokenWasRevoke = await authServices
      .deleteRefreshToken(req.cookies.refreshToken);

    if (refreshTokenWasRevoke) {
      return res.sendStatus(HTTP.NO_CONTENT_204);
    } else res.sendStatus(HTTP.UNAUTHORIZED_401);
  });

authRouter.get('/me',
  authMware,
  async (req: Request,
    res: Response<MeViewModel>) => {

    if (!req.user) {
      return res.sendStatus(HTTP.UNAUTHORIZED_401);
    };

    const user = {
      email: req.user.email,
      login: req.user.login,
      userId: req.user.id
    };

    res.status(HTTP.OK_200).json(user);
  });