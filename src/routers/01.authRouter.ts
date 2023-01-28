import { checkUsersRequest } from './../middlewares/checkUsersRequest';
import { checkCookie } from './../middlewares/checkCookieMware';
import { Router, Request, Response } from "express";
import { authServices } from '../domains/01.authServices';
import { checkReqBodyMware, testAddUserReqBody, testCodeReqBody, testEmailReqBody, testLoginPassReqBody, testReqRecoveryPass } from '../middlewares/checkReqBodyMware';
import { authMware } from '../middlewares/authMware';
import { LoginSuccessViewModel, MeViewModel, LoginInputModel, HTTP, RegistrationConfirmationCodeModel, UserInputModel, RegistrationEmailResending } from '../models';
import * as dotenv from 'dotenv';
import add from 'date-fns/add';

dotenv.config()

export const authRouter = Router({});

authRouter.post('/login',
  checkUsersRequest,
  testLoginPassReqBody,
  checkReqBodyMware,
  async (req: Request<LoginInputModel>,
    res: Response<LoginSuccessViewModel>) => {

    const ip = req.headers['x-forwarded-for']
      || req.socket.remoteAddress
      || null;

    const { loginOrEmail, password } = req.body;

    const deviceName =
      `${req.useragent?.browser} ${req.useragent?.version}`;

    const tokens = await authServices
      .checkAuth(loginOrEmail, password, ip, deviceName);

    if (tokens) {
      res.status(HTTP.OK_200)
        .cookie('refreshToken', tokens.refreshToken, {
          secure: process.env.NODE_ENV !== "cookie",
          httpOnly: true,
          expires: add(new Date(), { seconds: 20 }),
        })
        .json({ accessToken: tokens.accessToken }); // TEST #4.11
    } else res.sendStatus(HTTP.UNAUTHORIZED_401); // TEST #4.13
  });

authRouter.post('/password-recovery',
  checkUsersRequest,
  testEmailReqBody,
  checkReqBodyMware,
  async (req: Request, res: Response) => {

    await authServices
      .sendPasswordRecoveryCode(req.body.email);

    res.sendStatus(HTTP.NO_CONTENT_204);
  });

authRouter.post('/new-password',
  checkUsersRequest,
  testReqRecoveryPass,
  checkReqBodyMware,
  async (req: Request, res: Response) => {

    const updatePassword = await authServices.updatePassword
      (req.body.newPassword, req.body.recoveryCode);

    if (updatePassword) {
      res.sendStatus(HTTP.NO_CONTENT_204);
      return;
    } else {
      res.sendStatus(HTTP.BAD_REQUEST_400);
    }
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

    if (result) res.sendStatus(HTTP.NO_CONTENT_204);
    else res.status(HTTP.BAD_REQUEST_400).json(
      { errorsMessages: [{ message: 'incorrect code', field: 'code' }] }
    );
  });

authRouter.post('/registration',
  checkUsersRequest,
  testAddUserReqBody,
  checkReqBodyMware,
  async (req: Request<UserInputModel>,
    res: Response) => {

    const newUserId = await authServices
      .createUser(req.body, req.socket.remoteAddress);

    if (typeof newUserId === 'object') {
      res.status(HTTP.BAD_REQUEST_400).json(newUserId);
    } else res.sendStatus(HTTP.NO_CONTENT_204);
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
    else res.status(HTTP.BAD_REQUEST_400).json(
      { errorsMessages: [{ message: 'incorrect email', field: 'email' }] }
    );
  });

authRouter.post('/logout',
  checkCookie,
  async (req: Request, res: Response) => {

    const refreshTokenWasRevoke = await authServices
      .deleteRefreshToken(req.cookies.refreshToken);

    if (refreshTokenWasRevoke) res.sendStatus(HTTP.NO_CONTENT_204);
    else res.sendStatus(HTTP.UNAUTHORIZED_401);
  });

authRouter.get('/me',
  authMware,
  async (req: Request, res: Response<MeViewModel>) => {
    if (!req.user) {
      res.sendStatus(HTTP.UNAUTHORIZED_401);
      return;
    }
    const user = {
      email: req.user?.email,
      login: req.user?.login,
      userId: req.user?.id
    };
    res.status(HTTP.OK_200).json(user);
  });