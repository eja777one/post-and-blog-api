"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const _00_compositionRoot_1 = require("./00.compositionRoot");
const authController_1 = require("../features/users/api/authController");
const checkUsersRequest_1 = require("./../middlewares/checkUsersRequest");
const checkCookieMware_1 = require("./../middlewares/checkCookieMware");
const authMware_1 = require("../middlewares/authMware");
const checkReqBodyMware_1 = require("../middlewares/checkReqBodyMware");
exports.authRouter = (0, express_1.Router)({});
const authController = _00_compositionRoot_1.container.resolve(authController_1.AuthController);
exports.authRouter.post('/registration', checkUsersRequest_1.checkUsersRequest, checkReqBodyMware_1.testAddUserReqBody, checkReqBodyMware_1.checkReqBodyMware, authController.registration.bind(authController)); //ok
exports.authRouter.post('/registration-email-resending', checkUsersRequest_1.checkUsersRequest, checkReqBodyMware_1.testEmailReqBody, checkReqBodyMware_1.checkReqBodyMware, authController.resendEmailConfirm.bind(authController)); //ok
exports.authRouter.post('/registration-confirmation', checkUsersRequest_1.checkUsersRequest, checkReqBodyMware_1.testCodeReqBody, checkReqBodyMware_1.checkReqBodyMware, authController.confirmEmail.bind(authController)); //ok
exports.authRouter.post('/login', checkUsersRequest_1.checkUsersRequest, checkReqBodyMware_1.testLoginPassReqBody, checkReqBodyMware_1.checkReqBodyMware, authController.login.bind(authController)); //ok
exports.authRouter.post('/refresh-token', checkCookieMware_1.checkCookie, authController.refreshTokens.bind(authController)); //ok
exports.authRouter.post('/logout', checkCookieMware_1.checkCookie, authController.logout.bind(authController)); //ok
exports.authRouter.get('/me', authMware_1.authMware, authController.getMyInfo.bind(authController)); //ok
exports.authRouter.post('/password-recovery', checkUsersRequest_1.checkUsersRequest, checkReqBodyMware_1.testEmailReqBody, checkReqBodyMware_1.checkReqBodyMware, authController.sendPassRecoveryCode.bind(authController)); // ok
exports.authRouter.post('/new-password', checkUsersRequest_1.checkUsersRequest, checkReqBodyMware_1.testReqRecoveryPass, checkReqBodyMware_1.checkReqBodyMware, authController.setNewPassword.bind(authController));
