import { securityDeviceServices } from './../domains/06.securityDeviceServices';
import { checkCookie } from './../middlewares/checkCookieMware';
import { Router, Request, Response } from "express";
import { HTTP } from '../models';

export const securityDeviceRouter = Router({});

securityDeviceRouter.get('/',
  checkCookie,
  async (req: Request, res: Response) => {
    const usersSessions = await securityDeviceServices
      .getUsersSessions(req.cookies.refreshToken);

    if (usersSessions) {
      res.status(HTTP.OK_200).json(usersSessions);
    } else {
      res.sendStatus(HTTP.UNAUTHORIZED_401);
    };
  });

securityDeviceRouter.delete('/',
  checkCookie,
  async (req: Request, res: Response) => {
    const deleteOtherSessions = await securityDeviceServices
      .deleteOtherSessions(req.cookies.refreshToken);

    if (deleteOtherSessions) {
      res.sendStatus(HTTP.NO_CONTENT_204);
    } else {
      res.sendStatus(HTTP.UNAUTHORIZED_401);
    };
  });

securityDeviceRouter.delete('/:deviceId',
  checkCookie,
  async (req: Request, res: Response) => {
    const deleteThisSession = await securityDeviceServices
      .deleteThisSession(req.cookies.refreshToken, req.params.deviceId);

    if (deleteThisSession === '204') {
      res.sendStatus(HTTP.NO_CONTENT_204);
    } else if (deleteThisSession === '401') {
      res.sendStatus(HTTP.UNAUTHORIZED_401);
    } else if (deleteThisSession === '403') {
      res.sendStatus(HTTP.FORBIDDEN_403);
    } else {
      res.sendStatus(HTTP.NOT_FOUND_404);
    };
  });