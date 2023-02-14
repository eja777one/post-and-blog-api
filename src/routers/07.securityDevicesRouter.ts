import { Router } from "express";
import { container } from "./00.compositionRoot";
import { checkCookie } from './../middlewares/checkCookieMware';
import { SecurityDevicesController } from "../features/devices/api/securityDevicesController";

export const securityDevicesRouter = Router({});

const securityDevicesController = container.resolve(SecurityDevicesController);

securityDevicesRouter.get('/',
  checkCookie,
  securityDevicesController.getDevices.bind(securityDevicesController)); //ok

securityDevicesRouter.delete('/',
  checkCookie,
  securityDevicesController.deleteNonCurrentDevices
    .bind(securityDevicesController)); //ok

securityDevicesRouter.delete('/:deviceId',
  checkCookie,
  securityDevicesController.deleteDevice.bind(securityDevicesController)); //ok