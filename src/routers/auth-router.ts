import { LoginSuccessViewModel, MeViewModel } from './../models';
import { authMware } from '../middlewares/authMware';
import { jwtService } from './../application/jwt-service';
import { Router, Request, Response } from "express";
import { usersServices } from './../domains/users-services';
import { LoginInputModel, HTTP } from '../models';
import { checkReqBodyMware, testLoginPassReqBody } from '../middlewares/checkReqBodyMware';

export const authRouter = Router({});

authRouter.post('/login',
  testLoginPassReqBody,
  checkReqBodyMware,
  async (
    req: Request<LoginInputModel>,
    res: Response<LoginSuccessViewModel>
  ) => {
    const user = await usersServices
      .checkAuth(req.body.loginOrEmail, req.body.password);
    if (user) {
      const token = await jwtService.createJwt(user);
      res.status(HTTP.OK_200).json({ accessToken: token.token }); // TEST #4.11
    }
    else res.sendStatus(HTTP.UNAUTHORIZED_401); // TEST #4.13
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
