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
exports.securityDeviceRouter = void 0;
const _06_securityDeviceServices_1 = require("./../domains/06.securityDeviceServices");
const checkCookieMware_1 = require("./../middlewares/checkCookieMware");
const express_1 = require("express");
const models_1 = require("../models");
exports.securityDeviceRouter = (0, express_1.Router)({});
exports.securityDeviceRouter.get('/', checkCookieMware_1.checkCookie, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const usersSessions = yield _06_securityDeviceServices_1.securityDeviceServices
        .getUsersSessions(req.cookies.refreshToken);
    if (usersSessions) {
        res.status(models_1.HTTP.OK_200).json(usersSessions);
    }
    else {
        res.sendStatus(models_1.HTTP.UNAUTHORIZED_401);
    }
    ;
}));
exports.securityDeviceRouter.delete('/', checkCookieMware_1.checkCookie, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deleteOtherSessions = yield _06_securityDeviceServices_1.securityDeviceServices
        .deleteOtherSessions(req.cookies.refreshToken);
    if (deleteOtherSessions) {
        res.sendStatus(models_1.HTTP.NO_CONTENT_204);
    }
    else {
        res.sendStatus(models_1.HTTP.UNAUTHORIZED_401);
    }
    ;
}));
exports.securityDeviceRouter.delete('/:deviceId', checkCookieMware_1.checkCookie, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deleteThisSession = yield _06_securityDeviceServices_1.securityDeviceServices
        .deleteThisSession(req.cookies.refreshToken, req.params.deviceId);
    if (deleteThisSession === '204') {
        res.sendStatus(models_1.HTTP.NO_CONTENT_204);
    }
    else if (deleteThisSession === '401') {
        res.sendStatus(models_1.HTTP.UNAUTHORIZED_401);
    }
    else if (deleteThisSession === '403') {
        res.sendStatus(models_1.HTTP.FORBIDDEN_403);
    }
    else {
        res.sendStatus(models_1.HTTP.NOT_FOUND_404);
    }
    ;
}));
