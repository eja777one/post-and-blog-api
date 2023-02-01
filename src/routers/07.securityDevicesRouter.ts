import { DeviceViewModel } from './../models';
import { Router, Request, Response } from "express";
import { securityDevicesService } from '../domains/06.securityDevicesService';
import { checkCookie } from './../middlewares/checkCookieMware';
import { HTTP } from '../models';

export const securityDevicesRouter = Router({});

class SecurityDevicesController {
  async getDevices(req: Request, res: Response<DeviceViewModel[]>) {
    const usersSessions = await securityDevicesService
      .getUsersSessions(req.cookies.refreshToken);

    if (!usersSessions) return res.sendStatus(HTTP.UNAUTHORIZED_401);

    res.status(HTTP.OK_200).json(usersSessions);
  }

  async deleteNonCurrentDevices(req: Request, res: Response) {
    const deleteOtherSessions = await securityDevicesService
      .deleteOtherSessions(req.cookies.refreshToken);

    if (!deleteOtherSessions) return res.sendStatus(HTTP.UNAUTHORIZED_401);

    res.sendStatus(HTTP.NO_CONTENT_204);
  }

  async deleteDevice(req: Request, res: Response) {
    const deleteThisSession = await securityDevicesService
      .deleteThisSession(req.cookies.refreshToken, req.params.deviceId);

    res.sendStatus(HTTP[deleteThisSession]);
  }
};

const securityDevicesController = new SecurityDevicesController();

securityDevicesRouter.get('/',
  checkCookie,
  securityDevicesController.getDevices);

securityDevicesRouter.delete('/',
  checkCookie,
  securityDevicesController.deleteNonCurrentDevices);

securityDevicesRouter.delete('/:deviceId',
  checkCookie,
  securityDevicesController.deleteDevice);