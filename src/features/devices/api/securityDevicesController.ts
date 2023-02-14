import { inject, injectable } from 'inversify';
import { Request, Response } from "express";
import { SecurityDevicesService } from '../application/securityDevicesService';
import { DeviceViewModel } from '../../../models';

@injectable()
export class SecurityDevicesController {
  constructor(
    @inject(SecurityDevicesService) protected securityDevicesService:
      SecurityDevicesService
  ) { }

  async getDevices(req: Request, res: Response<DeviceViewModel[]>) {
    const result = await this.securityDevicesService
      .getUsersSessions(req.cookies.refreshToken);
    res.status(result.statusCode).json(result.data);
  }

  async deleteNonCurrentDevices(req: Request, res: Response) {
    const result = await this.securityDevicesService
      .deleteOtherSessions(req.cookies.refreshToken);
    res.sendStatus(result.statusCode);
  }

  async deleteDevice(req: Request, res: Response) {
    const result = await this.securityDevicesService
      .deleteThisSession(req.cookies.refreshToken, req.params.deviceId);
    res.sendStatus(result.statusCode);
  }
};