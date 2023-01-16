import { usersQueryRepository } from './../repositories/05.usersQueryRepository';
import { Router, Request, Response } from "express";
import { authServices } from '../domains/01.authServices';
import { usersServices } from '../domains/05.usersServices';
import { checkReqBodyMware, testAddUserReqBody, testCodeReqBody, testEmailReqBody, testLoginPassReqBody } from '../middlewares/checkReqBodyMware';
import { authMware } from '../middlewares/authMware';
import { jwtService } from '../application/jwt-service';
import { LoginSuccessViewModel, MeViewModel, LoginInputModel, HTTP, RegistrationConfirmationCodeModel, UserInputModel, RegistrationEmailResending } from '../models';

export const authRouter = Router({});

authRouter.post('/login',
  testLoginPassReqBody,
  checkReqBodyMware,
  async (req: Request<LoginInputModel>,
    res: Response<LoginSuccessViewModel>) => {

    const user = await authServices
      .checkAuth(req.body.loginOrEmail, req.body.password);

    if (user) {
      const token = await jwtService.createJwt(user);
      res.status(HTTP.OK_200).json({ accessToken: token.token }); // TEST #4.11
    }
    else res.sendStatus(HTTP.UNAUTHORIZED_401); // TEST #4.13
  });

authRouter.post('/registration-confirmation',
  testCodeReqBody,
  checkReqBodyMware,
  async (req: Request<RegistrationConfirmationCodeModel>,
    res: Response) => {
    const result = await authServices.confirmEmail(req.body.code);
    console.log(result);
    if (result) res.sendStatus(HTTP.NO_CONTENT_204);
    else res.sendStatus(HTTP.BAD_REQUEST_400);
  });

authRouter.post('/registration',
  testAddUserReqBody,
  checkReqBodyMware,
  async (req: Request<UserInputModel>,
    res: Response) => {
    const newUserId = await authServices.createUser(req.body, req.socket.remoteAddress);
    if (newUserId) res.sendStatus(HTTP.NO_CONTENT_204);
    else res.sendStatus(HTTP.BAD_REQUEST_400);
  });

authRouter.post('/registration-email-resending',
  testEmailReqBody,
  checkReqBodyMware,
  async (req: Request<RegistrationEmailResending>,
    res: Response) => {
    const result = await authServices.resendConfirmation(req.body.email);
    if (result) res.sendStatus(HTTP.NO_CONTENT_204);
    else res.sendStatus(HTTP.BAD_REQUEST_400);
  });

authRouter.get('/me',
  authMware,
  async (
    req: Request,
    res: Response<MeViewModel>
  ) => {
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