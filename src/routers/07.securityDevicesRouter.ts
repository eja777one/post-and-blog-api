import { Router, Request, Response } from "express";
import { securityDeviceServices } from './../domains/06.securityDeviceServices';
import { checkCookie } from './../middlewares/checkCookieMware';
import { HTTP } from '../models';

export const securityDeviceRouter = Router({});

securityDeviceRouter.get('/',
  checkCookie,
  async (req: Request, res: Response) => {

    const usersSessions = await securityDeviceServices
      .getUsersSessions(req.cookies.refreshToken);

    if (!usersSessions) return res.sendStatus(HTTP.UNAUTHORIZED_401);

    res.status(HTTP.OK_200).json(usersSessions);
  });

securityDeviceRouter.delete('/',
  checkCookie,
  async (req: Request, res: Response) => {

    const deleteOtherSessions = await securityDeviceServices
      .deleteOtherSessions(req.cookies.refreshToken);

    if (!deleteOtherSessions) return res.sendStatus(HTTP.UNAUTHORIZED_401);

    res.sendStatus(HTTP.NO_CONTENT_204);
  });

securityDeviceRouter.delete('/:deviceId',
  checkCookie,
  async (req: Request, res: Response) => {

    const deleteThisSession = await securityDeviceServices
      .deleteThisSession(req.cookies.refreshToken, req.params.deviceId);

    res.sendStatus(HTTP[deleteThisSession]);
  });