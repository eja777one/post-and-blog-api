"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const checkUsersRequest_1 = require("./../middlewares/checkUsersRequest");
const checkCookieMware_1 = require("./../middlewares/checkCookieMware");
const express_1 = require("express");
const _01_authServices_1 = require("../domains/01.authServices");
const checkReqBodyMware_1 = require("../middlewares/checkReqBodyMware");
const authMware_1 = require("../middlewares/authMware");
const models_1 = require("../models");
const dotenv = __importStar(require("dotenv"));
const add_1 = __importDefault(require("date-fns/add"));
dotenv.config();
exports.authRouter = (0, express_1.Router)({});
exports.authRouter.post('/login', checkUsersRequest_1.checkUsersRequest, checkReqBodyMware_1.testLoginPassReqBody, checkReqBodyMware_1.checkReqBodyMware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const ip = req.headers['x-forwarded-for']
        || req.socket.remoteAddress
        || null;
    const { loginOrEmail, password } = req.body;
    const deviceName = `${(_a = req.useragent) === null || _a === void 0 ? void 0 : _a.browser} ${(_b = req.useragent) === null || _b === void 0 ? void 0 : _b.version}`;
    const tokens = yield _01_authServices_1.authServices
        .checkAuth(loginOrEmail, password, ip, deviceName);
    if (tokens) {
        res.status(models_1.HTTP.OK_200)
            .cookie('refreshToken', tokens.refreshToken, {
            secure: process.env.NODE_ENV !== "cookie",
            httpOnly: true,
            expires: (0, add_1.default)(new Date(), { seconds: 20 }),
        })
            .json({ accessToken: tokens.accessToken }); // TEST #4.11
    }
    else
        res.sendStatus(models_1.HTTP.UNAUTHORIZED_401); // TEST #4.13
}));
exports.authRouter.post('/password-recovery', checkUsersRequest_1.checkUsersRequest, checkReqBodyMware_1.testEmailReqBody, checkReqBodyMware_1.checkReqBodyMware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield _01_authServices_1.authServices
        .sendPasswordRecoveryCode(req.body.email);
    res.sendStatus(models_1.HTTP.NO_CONTENT_204);
}));
exports.authRouter.post('/new-password', checkUsersRequest_1.checkUsersRequest, checkReqBodyMware_1.testReqRecoveryPass, checkReqBodyMware_1.checkReqBodyMware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updatePassword = yield _01_authServices_1.authServices.updatePassword(req.body.newPassword, req.body.recoveryCode);
    if (updatePassword === true) {
        res.sendStatus(models_1.HTTP.NO_CONTENT_204);
        return;
    }
    else {
        res.status(models_1.HTTP.BAD_REQUEST_400).json(updatePassword);
    }
}));
exports.authRouter.post('/refresh-token', checkCookieMware_1.checkCookie, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tokens = yield _01_authServices_1.authServices
        .getNewTokensPair(req.cookies.refreshToken);
    if (tokens) {
        res.status(models_1.HTTP.OK_200)
            .cookie('refreshToken', tokens.newRefreshToken, {
            secure: process.env.NODE_ENV !== "cookie",
            httpOnly: true,
            expires: (0, add_1.default)(new Date(), { seconds: 20 }),
        })
            .json({ accessToken: tokens.newAccessToken });
    }
    else
        res.sendStatus(models_1.HTTP.UNAUTHORIZED_401);
}));
exports.authRouter.post('/registration-confirmation', checkUsersRequest_1.checkUsersRequest, checkReqBodyMware_1.testCodeReqBody, checkReqBodyMware_1.checkReqBodyMware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield _01_authServices_1.authServices.confirmEmail(req.body.code);
    if (result)
        res.sendStatus(models_1.HTTP.NO_CONTENT_204);
    else
        res.status(models_1.HTTP.BAD_REQUEST_400).json({ errorsMessages: [{ message: 'incorrect code', field: 'code' }] });
}));
exports.authRouter.post('/registration', checkUsersRequest_1.checkUsersRequest, checkReqBodyMware_1.testAddUserReqBody, checkReqBodyMware_1.checkReqBodyMware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newUserId = yield _01_authServices_1.authServices
        .createUser(req.body, req.socket.remoteAddress);
    if (typeof newUserId === 'object') {
        res.status(models_1.HTTP.BAD_REQUEST_400).json(newUserId);
    }
    else
        res.sendStatus(models_1.HTTP.NO_CONTENT_204);
}));
exports.authRouter.post('/registration-email-resending', checkUsersRequest_1.checkUsersRequest, checkReqBodyMware_1.testEmailReqBody, checkReqBodyMware_1.checkReqBodyMware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield _01_authServices_1.authServices
        .resendConfirmation(req.body.email);
    if (result)
        res.sendStatus(models_1.HTTP.NO_CONTENT_204);
    else
        res.status(models_1.HTTP.BAD_REQUEST_400).json({ errorsMessages: [{ message: 'incorrect email', field: 'email' }] });
}));
exports.authRouter.post('/logout', checkCookieMware_1.checkCookie, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshTokenWasRevoke = yield _01_authServices_1.authServices
        .deleteRefreshToken(req.cookies.refreshToken);
    if (refreshTokenWasRevoke)
        res.sendStatus(models_1.HTTP.NO_CONTENT_204);
    else
        res.sendStatus(models_1.HTTP.UNAUTHORIZED_401);
}));
exports.authRouter.get('/me', authMware_1.authMware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d, _e;
    if (!req.user) {
        res.sendStatus(models_1.HTTP.UNAUTHORIZED_401);
        return;
    }
    const user = {
        email: (_c = req.user) === null || _c === void 0 ? void 0 : _c.email,
        login: (_d = req.user) === null || _d === void 0 ? void 0 : _d.login,
        userId: (_e = req.user) === null || _e === void 0 ? void 0 : _e.id
    };
    res.status(models_1.HTTP.OK_200).json(user);
}));
