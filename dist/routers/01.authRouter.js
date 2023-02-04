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
const express_1 = require("express");
const _01_authService_1 = require("../domains/01.authService");
const checkUsersRequest_1 = require("./../middlewares/checkUsersRequest");
const checkCookieMware_1 = require("./../middlewares/checkCookieMware");
const authMware_1 = require("../middlewares/authMware");
const checkReqBodyMware_1 = require("../middlewares/checkReqBodyMware");
const models_1 = require("../models");
const dotenv = __importStar(require("dotenv"));
const add_1 = __importDefault(require("date-fns/add"));
dotenv.config();
exports.authRouter = (0, express_1.Router)({});
const recoveryCodeError = {
    errorsMessages: [{ message: 'incorrect recoveryCode', field: 'recoveryCode' }]
};
const confirmCodeError = {
    errorsMessages: [{ message: 'incorrect code', field: 'code' }]
};
const emailError = {
    errorsMessages: [{ message: 'incorrect email', field: 'email' }]
};
const loginIsExistError = {
    errorsMessages: [{ message: 'incorrect login', field: 'login' }]
};
class AuthController {
    constructor() {
        this.authService = new _01_authService_1.AuthService();
    }
    login(req, res) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const ip = req.ip;
            const { loginOrEmail, password } = req.body;
            const deviceName = `${(_a = req.useragent) === null || _a === void 0 ? void 0 : _a.browser} ${(_b = req.useragent) === null || _b === void 0 ? void 0 : _b.version}`;
            const tokens = yield this.authService
                .checkAuth(loginOrEmail, password, ip, deviceName);
            if (!tokens)
                return res.sendStatus(models_1.HTTP.UNAUTHORIZED_401);
            res.status(models_1.HTTP.OK_200)
                .cookie('refreshToken', tokens.refreshToken, {
                secure: process.env.NODE_ENV !== "cookie",
                httpOnly: true,
                expires: (0, add_1.default)(new Date(), { seconds: 20 }),
            })
                .json({ accessToken: tokens.accessToken });
        });
    }
    sendPassRecoveryCode(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.authService.sendPasswordRecoveryCode(req.body.email);
            res.sendStatus(models_1.HTTP.NO_CONTENT_204);
        });
    }
    setNewPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.authService.updatePassword(req.body.newPassword, req.body.recoveryCode);
            if (result)
                return res.sendStatus(models_1.HTTP.NO_CONTENT_204);
            else
                res.status(models_1.HTTP.BAD_REQUEST_400).json(recoveryCodeError);
        });
    }
    refreshTokens(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokens = yield this.authService
                .getNewTokensPair(req.cookies.refreshToken);
            if (!tokens)
                return res.sendStatus(models_1.HTTP.UNAUTHORIZED_401);
            res.status(models_1.HTTP.OK_200)
                .cookie('refreshToken', tokens.newRefreshToken, {
                secure: process.env.NODE_ENV !== "cookie",
                httpOnly: true,
                expires: (0, add_1.default)(new Date(), { seconds: 20 }),
            })
                .json({ accessToken: tokens.newAccessToken });
        });
    }
    confirmEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.authService.confirmEmail(req.body.code);
            if (result)
                res.sendStatus(models_1.HTTP.NO_CONTENT_204);
            else
                res.status(models_1.HTTP.BAD_REQUEST_400).json(confirmCodeError);
        });
    }
    registration(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userWasAdded = yield this.authService.createUser(req.body, req.ip);
            if (!userWasAdded || userWasAdded === 'emailIsExist') {
                return res.status(models_1.HTTP.BAD_REQUEST_400).json(emailError);
            }
            ;
            if (userWasAdded === 'loginIsExist') {
                return res.status(models_1.HTTP.BAD_REQUEST_400).json(loginIsExistError);
            }
            ;
            return res.sendStatus(models_1.HTTP.NO_CONTENT_204);
        });
    }
    resendEmailConfirm(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.authService.resendConfirmation(req.body.email);
            if (result)
                res.sendStatus(models_1.HTTP.NO_CONTENT_204);
            else
                res.status(models_1.HTTP.BAD_REQUEST_400).json(emailError);
        });
    }
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshTokenWasRevoke = yield this.authService
                .deleteRefreshToken(req.cookies.refreshToken);
            if (refreshTokenWasRevoke)
                return res.sendStatus(models_1.HTTP.NO_CONTENT_204);
            res.sendStatus(models_1.HTTP.UNAUTHORIZED_401);
        });
    }
    getMyInfo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.user)
                return res.sendStatus(models_1.HTTP.UNAUTHORIZED_401);
            const user = {
                email: req.user.email,
                login: req.user.login,
                userId: req.user.id
            };
            res.status(models_1.HTTP.OK_200).json(user);
        });
    }
}
;
const authController = new AuthController();
exports.authRouter.post('/login', checkUsersRequest_1.checkUsersRequest, checkReqBodyMware_1.testLoginPassReqBody, checkReqBodyMware_1.checkReqBodyMware, authController.login.bind(authController));
exports.authRouter.post('/password-recovery', checkUsersRequest_1.checkUsersRequest, checkReqBodyMware_1.testEmailReqBody, checkReqBodyMware_1.checkReqBodyMware, authController.sendPassRecoveryCode.bind(authController));
exports.authRouter.post('/new-password', checkUsersRequest_1.checkUsersRequest, checkReqBodyMware_1.testReqRecoveryPass, checkReqBodyMware_1.checkReqBodyMware, authController.setNewPassword.bind(authController));
exports.authRouter.post('/refresh-token', checkCookieMware_1.checkCookie, authController.refreshTokens.bind(authController));
exports.authRouter.post('/registration-confirmation', checkUsersRequest_1.checkUsersRequest, checkReqBodyMware_1.testCodeReqBody, checkReqBodyMware_1.checkReqBodyMware, authController.confirmEmail.bind(authController));
exports.authRouter.post('/registration', checkUsersRequest_1.checkUsersRequest, checkReqBodyMware_1.testAddUserReqBody, checkReqBodyMware_1.checkReqBodyMware, authController.registration.bind(authController));
exports.authRouter.post('/registration-email-resending', checkUsersRequest_1.checkUsersRequest, checkReqBodyMware_1.testEmailReqBody, checkReqBodyMware_1.checkReqBodyMware, authController.resendEmailConfirm.bind(authController));
exports.authRouter.post('/logout', checkCookieMware_1.checkCookie, authController.logout.bind(authController));
exports.authRouter.get('/me', authMware_1.authMware, authController.getMyInfo.bind(authController));
