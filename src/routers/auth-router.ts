import { Router, Request, Response } from "express";
import { usersServices } from './../domains/users-services';
import { LoginInputModel, HTTP } from '../models';
import { checkReqBodyMware, testLoginPassReqBody } from '../middlewares/checkReqBodyMware';

export const authRouter = Router({});

authRouter.post('/',
  testLoginPassReqBody,
  checkReqBodyMware,
  async (
    req: Request<LoginInputModel>,
    res: Response
  ) => {
    const result = await usersServices
      .checkAuth(req.body.loginOrEmail, req.body.password);
    if (result) res.sendStatus(HTTP.NO_CONTENT_204); // TEST #4.11
    else res.sendStatus(HTTP.UNAUTHORIZED_401); // TEST #4.13
  });
