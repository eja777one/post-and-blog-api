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
exports.authRouter = void 0;
const _05_usersQueryRepository_1 = require("./../repositories/05.usersQueryRepository");
const express_1 = require("express");
const _01_authServices_1 = require("../domains/01.authServices");
const checkReqBodyMware_1 = require("../middlewares/checkReqBodyMware");
const authMware_1 = require("../middlewares/authMware");
const jwt_service_1 = require("../application/jwt-service");
const models_1 = require("../models");
exports.authRouter = (0, express_1.Router)({});
exports.authRouter.post('/login', checkReqBodyMware_1.testLoginPassReqBody, checkReqBodyMware_1.checkReqBodyMware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield _01_authServices_1.authServices
        .checkAuth(req.body.loginOrEmail, req.body.password);
    if (user) {
        const token = yield jwt_service_1.jwtService.createJwt(user);
        res.status(models_1.HTTP.OK_200).json({ accessToken: token.token }); // TEST #4.11
    }
    else
        res.sendStatus(models_1.HTTP.UNAUTHORIZED_401); // TEST #4.13
}));
exports.authRouter.post('/registration-confirmation', checkReqBodyMware_1.testCodeReqBody, checkReqBodyMware_1.checkReqBodyMware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield _01_authServices_1.authServices.confirmEmail(req.body.code);
    console.log(result);
    if (result)
        res.send(models_1.HTTP.NO_CONTENT_204);
    else
        res.send(models_1.HTTP.BAD_REQUEST_400);
}));
exports.authRouter.post('/registration', checkReqBodyMware_1.testAddUserReqBody, checkReqBodyMware_1.checkReqBodyMware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newUserId = yield _01_authServices_1.authServices.createUser(req.body, req.socket.remoteAddress);
    if (newUserId) {
        const user = yield _05_usersQueryRepository_1.usersQueryRepository.getDbUserById(newUserId);
        res.sendStatus(models_1.HTTP.NO_CONTENT_204);
    }
    else
        res.sendStatus(models_1.HTTP.BAD_REQUEST_400);
}));
exports.authRouter.post('/registration-email-resending', checkReqBodyMware_1.testEmailReqBody, checkReqBodyMware_1.checkReqBodyMware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield _01_authServices_1.authServices.resendConfirmation(req.body.email);
    if (result)
        res.send(models_1.HTTP.NO_CONTENT_204);
    else
        res.send(models_1.HTTP.BAD_REQUEST_400);
}));
exports.authRouter.get('/me', authMware_1.authMware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    if (!req.user) {
        res.sendStatus(models_1.HTTP.UNAUTHORIZED_401);
        return;
    }
    const user = {
        email: (_a = req.user) === null || _a === void 0 ? void 0 : _a.email,
        login: (_b = req.user) === null || _b === void 0 ? void 0 : _b.login,
        userId: (_c = req.user) === null || _c === void 0 ? void 0 : _c.id
    };
    res.status(models_1.HTTP.OK_200).json(user);
}));
