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
const auth_services_1 = require("./../domains/auth-services");
const authMware_1 = require("../middlewares/authMware");
const jwt_service_1 = require("./../application/jwt-service");
const express_1 = require("express");
const users_services_1 = require("./../domains/users-services");
const models_1 = require("../models");
const checkReqBodyMware_1 = require("../middlewares/checkReqBodyMware");
exports.authRouter = (0, express_1.Router)({});
exports.authRouter.post('/registration', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield auth_services_1.authServices.createUser(req.body);
    res.status(201).send();
}));
exports.authRouter.post('/login', checkReqBodyMware_1.testLoginPassReqBody, checkReqBodyMware_1.checkReqBodyMware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield users_services_1.usersServices
        .checkAuth(req.body.loginOrEmail, req.body.password);
    if (user) {
        const token = yield jwt_service_1.jwtService.createJwt(user);
        res.status(models_1.HTTP.OK_200).json({ accessToken: token.token }); // TEST #4.11
    }
    else
        res.sendStatus(models_1.HTTP.UNAUTHORIZED_401); // TEST #4.13
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
