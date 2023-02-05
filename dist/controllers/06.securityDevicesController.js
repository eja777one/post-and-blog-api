"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityDevicesController = void 0;
const models_1 = require("../models");
class SecurityDevicesController {
    constructor(securityDevicesService) {
        this.securityDevicesService = securityDevicesService;
    }
    getDevices(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const usersSessions = yield this.securityDevicesService
                .getUsersSessions(req.cookies.refreshToken);
            if (!usersSessions)
                return res.sendStatus(models_1.HTTP.UNAUTHORIZED_401);
            res.status(models_1.HTTP.OK_200).json(usersSessions);
        });
    }
    deleteNonCurrentDevices(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleteOtherSessions = yield this.securityDevicesService
                .deleteOtherSessions(req.cookies.refreshToken);
            if (!deleteOtherSessions)
                return res.sendStatus(models_1.HTTP.UNAUTHORIZED_401);
            res.sendStatus(models_1.HTTP.NO_CONTENT_204);
        });
    }
    deleteDevice(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleteThisSession = yield this.securityDevicesService
                .deleteThisSession(req.cookies.refreshToken, req.params.deviceId);
            res.sendStatus(models_1.HTTP[deleteThisSession]);
        });
    }
}
exports.SecurityDevicesController = SecurityDevicesController;
;
