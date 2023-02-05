import { Request, Response } from "express";
import { SecurityDevicesService } from '../domains/06.securityDevicesService';
import { HTTP, DeviceViewModel } from '../models';

export class SecurityDevicesController {
  constructor(protected securityDevicesService: SecurityDevicesService) { }

  async getDevices(req: Request, res: Response<DeviceViewModel[]>) {
    const usersSessions = await this.securityDevicesService
      .getUsersSessions(req.cookies.refreshToken);

    if (!usersSessions) return res.sendStatus(HTTP.UNAUTHORIZED_401);

    res.status(HTTP.OK_200).json(usersSessions);
  }

  async deleteNonCurrentDevices(req: Request, res: Response) {
    const deleteOtherSessions = await this.securityDevicesService
      .deleteOtherSessions(req.cookies.refreshToken);

    if (!deleteOtherSessions) return res.sendStatus(HTTP.UNAUTHORIZED_401);

    res.sendStatus(HTTP.NO_CONTENT_204);
  }

  async deleteDevice(req: Request, res: Response) {
    const deleteThisSession = await this.securityDevicesService
      .deleteThisSession(req.cookies.refreshToken, req.params.deviceId);

    res.sendStatus(HTTP[deleteThisSession]);
  }
};