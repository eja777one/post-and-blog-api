import { Router } from "express";
import { usersController } from "./00.compositionRoot";
import { checkAuthMware } from "../middlewares/checkAuthMware";
import { checkIsObjectId } from '../middlewares/checkParamMware';
import { checkReqBodyMware, testAddUserReqBody }
  from "../middlewares/checkReqBodyMware";

export const usersRouter = Router({});

usersRouter.get('/',
  checkAuthMware,
  usersController.getUsers.bind(usersController));

usersRouter.post('/',
  checkAuthMware,
  testAddUserReqBody,
  checkReqBodyMware,
  usersController.createUser.bind(usersController));

usersRouter.delete('/:id',
  checkAuthMware,
  checkIsObjectId,
  usersController.deleteUser.bind(usersController));