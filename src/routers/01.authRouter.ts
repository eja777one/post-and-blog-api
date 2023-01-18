import { Router, Request, Response } from "express";
import { authServices } from '../domains/01.authServices';
import { checkReqBodyMware, testAddUserReqBody, testCodeReqBody, testEmailReqBody, testLoginPassReqBody } from '../middlewares/checkReqBodyMware';
import { authMware } from '../middlewares/authMware';
import { LoginSuccessViewModel, MeViewModel, LoginInputModel, HTTP, RegistrationConfirmationCodeModel, UserInputModel, RegistrationEmailResending } from '../models';
import * as dotenv from 'dotenv';
import add from 'date-fns/add';

dotenv.config()

export const authRouter = Router({});

authRouter.post('/login',
  testLoginPassReqBody,
  checkReqBodyMware,
  async (req: Request<LoginInputModel>,
    res: Response<LoginSuccessViewModel>) => {

    const tokens = await authServices
      .checkAuth(req.body.loginOrEmail, req.body.password);

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

authRouter.post('/logout',
  async (req: Request, res: Response) => {
    if (!req.cookies.refreshToken) {
      res.sendStatus(HTTP.UNAUTHORIZED_401);
      return
    }
    const refreshTokenWasRevoke = await authServices
      .deleteRefreshToken(req.cookies.refreshToken);

    if (refreshTokenWasRevoke) res.sendStatus(HTTP.NO_CONTENT_204);
    else res.sendStatus(HTTP.UNAUTHORIZED_401);
  });

authRouter.post('/refresh-token',
  async (req: Request, res: Response) => {
    if (!req.cookies.refreshToken) {
      res.sendStatus(HTTP.UNAUTHORIZED_401);
      return;
    };

    const tokens = await authServices.getNewTokensPair(req.cookies.refreshToken);

    if (!tokens) {
      res.sendStatus(HTTP.UNAUTHORIZED_401);
      return;
    }

    res.status(HTTP.OK_200)
      .cookie('refreshToken', tokens.newRefreshToken, {
        secure: process.env.NODE_ENV !== "cookie",
        httpOnly: true,
        expires: add(new Date(), { seconds: 20 }),
      })
      .json({ accessToken: tokens.newAccessToken });
      
  });

authRouter.post('/registration-confirmation',
  testCodeReqBody,
  checkReqBodyMware,
  async (req: Request<RegistrationConfirmationCodeModel>,
    res: Response) => {
    const result = await authServices.confirmEmail(req.body.code);
    console.log(result);
    if (result) res.sendStatus(HTTP.NO_CONTENT_204);
    else res.status(HTTP.BAD_REQUEST_400).json(
      { errorsMessages: [{ message: 'incorrect code', field: 'code' }] }
    );
  });

authRouter.post('/registration',
  testAddUserReqBody,
  checkReqBodyMware,
  async (req: Request<UserInputModel>,
    res: Response) => {
    const newUserId = await authServices.createUser(req.body, req.socket.remoteAddress);
    if (typeof newUserId === 'object') res.status(HTTP.BAD_REQUEST_400).json(newUserId)
    else res.sendStatus(HTTP.NO_CONTENT_204);;
  });

authRouter.post('/registration-email-resending',
  testEmailReqBody,
  checkReqBodyMware,
  async (req: Request<RegistrationEmailResending>,
    res: Response) => {
    const result = await authServices.resendConfirmation(req.body.email);
    if (result) res.sendStatus(HTTP.NO_CONTENT_204);
    else res.status(HTTP.BAD_REQUEST_400).json(
      { errorsMessages: [{ message: 'incorrect email', field: 'email' }] }
    );
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