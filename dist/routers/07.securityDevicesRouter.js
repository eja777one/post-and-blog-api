"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.securityDevicesRouter = void 0;
const express_1 = require("express");
const _00_compositionRoot_1 = require("./00.compositionRoot");
const checkCookieMware_1 = require("./../middlewares/checkCookieMware");
const securityDevicesController_1 = require("../features/devices/api/securityDevicesController");
exports.securityDevicesRouter = (0, express_1.Router)({});
const securityDevicesController = _00_compositionRoot_1.container.resolve(securityDevicesController_1.SecurityDevicesController);
exports.securityDevicesRouter.get('/', checkCookieMware_1.checkCookie, securityDevicesController.getDevices.bind(securityDevicesController)); //ok
exports.securityDevicesRouter.delete('/', checkCookieMware_1.checkCookie, securityDevicesController.deleteNonCurrentDevices
    .bind(securityDevicesController)); //ok
exports.securityDevicesRouter.delete('/:deviceId', checkCookieMware_1.checkCookie, securityDevicesController.deleteDevice.bind(securityDevicesController)); //ok
