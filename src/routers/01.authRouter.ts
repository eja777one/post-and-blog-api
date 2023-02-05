import { authController } from './00.compositionRoot';
import { Router } from "express";
import { checkUsersRequest } from './../middlewares/checkUsersRequest';
import { checkCookie } from './../middlewares/checkCookieMware';
import { authMware } from '../middlewares/authMware';
import {
  checkReqBodyMware,
  testAddUserReqBody,
  testCodeReqBody,
  testEmailReqBody,
  testLoginPassReqBody,
  testReqRecoveryPass
} from '../middlewares/checkReqBodyMware';

export const authRouter = Router({});

authRouter.post('/login',
  checkUsersRequest,
  testLoginPassReqBody,
  checkReqBodyMware,
  authController.login.bind(authController));

authRouter.post('/password-recovery',
  checkUsersRequest,
  testEmailReqBody,
  checkReqBodyMware,
  authController.sendPassRecoveryCode.bind(authController));

authRouter.post('/new-password',
  checkUsersRequest,
  testReqRecoveryPass,
  checkReqBodyMware,
  authController.setNewPassword.bind(authController));

authRouter.post('/refresh-token',
  checkCookie,
  authController.refreshTokens.bind(authController));

authRouter.post('/registration-confirmation',
  checkUsersRequest,
  testCodeReqBody,
  checkReqBodyMware,
  authController.confirmEmail.bind(authController));

authRouter.post('/registration',
  checkUsersRequest,
  testAddUserReqBody,
  checkReqBodyMware,
  authController.registration.bind(authController));

authRouter.post('/registration-email-resending',
  checkUsersRequest,
  testEmailReqBody,
  checkReqBodyMware,
  authController.resendEmailConfirm.bind(authController));

authRouter.post('/logout',
  checkCookie,
  authController.logout.bind(authController));

authRouter.get('/me',
  authMware,
  authController.getMyInfo.bind(authController));