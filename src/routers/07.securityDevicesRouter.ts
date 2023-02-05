import { Router } from "express";
import { securityDevicesController } from "./00.compositionRoot";
import { checkCookie } from './../middlewares/checkCookieMware';

export const securityDevicesRouter = Router({});

securityDevicesRouter.get('/',
  checkCookie,
  securityDevicesController.getDevices.bind(securityDevicesController));

securityDevicesRouter.delete('/',
  checkCookie,
  securityDevicesController.deleteNonCurrentDevices
    .bind(securityDevicesController));

securityDevicesRouter.delete('/:deviceId',
  checkCookie,
  securityDevicesController.deleteDevice.bind(securityDevicesController));