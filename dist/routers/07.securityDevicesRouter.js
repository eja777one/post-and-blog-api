"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.securityDevicesRouter = void 0;
const express_1 = require("express");
const _00_compositionRoot_1 = require("./00.compositionRoot");
const checkCookieMware_1 = require("./../middlewares/checkCookieMware");
exports.securityDevicesRouter = (0, express_1.Router)({});
exports.securityDevicesRouter.get('/', checkCookieMware_1.checkCookie, _00_compositionRoot_1.securityDevicesController.getDevices.bind(_00_compositionRoot_1.securityDevicesController));
exports.securityDevicesRouter.delete('/', checkCookieMware_1.checkCookie, _00_compositionRoot_1.securityDevicesController.deleteNonCurrentDevices
    .bind(_00_compositionRoot_1.securityDevicesController));
exports.securityDevicesRouter.delete('/:deviceId', checkCookieMware_1.checkCookie, _00_compositionRoot_1.securityDevicesController.deleteDevice.bind(_00_compositionRoot_1.securityDevicesController));
