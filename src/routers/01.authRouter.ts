import { Router } from "express";
import { container } from './00.compositionRoot';
import { AuthController } from '../features/users/api/authController';
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

const authController = container.resolve(AuthController);

authRouter.post('/registration',
  checkUsersRequest,
  testAddUserReqBody,
  checkReqBodyMware,
  authController.registration.bind(authController)); //ok

authRouter.post('/registration-email-resending',
  checkUsersRequest,
  testEmailReqBody,
  checkReqBodyMware,
  authController.resendEmailConfirm.bind(authController)); //ok

authRouter.post('/registration-confirmation',
  checkUsersRequest,
  testCodeReqBody,
  checkReqBodyMware,
  authController.confirmEmail.bind(authController)); //ok

authRouter.post('/login',
  checkUsersRequest,
  testLoginPassReqBody,
  checkReqBodyMware,
  authController.login.bind(authController)); //ok

authRouter.post('/refresh-token',
  checkCookie,
  authController.refreshTokens.bind(authController)); //ok

authRouter.post('/logout',
  checkCookie,
  authController.logout.bind(authController)); //ok

authRouter.get('/me',
  authMware,
  authController.getMyInfo.bind(authController)); //ok

authRouter.post('/password-recovery',
  checkUsersRequest,
  testEmailReqBody,
  checkReqBodyMware,
  authController.sendPassRecoveryCode.bind(authController)); // ok

authRouter.post('/new-password',
  checkUsersRequest,
  testReqRecoveryPass,
  checkReqBodyMware,
  authController.setNewPassword.bind(authController));