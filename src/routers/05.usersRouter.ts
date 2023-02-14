import { Router } from "express";
import { UsersController } from "../features/users/api/usersController";
import { container } from "./00.compositionRoot";
import { checkAuthMware } from "../middlewares/checkAuthMware";
import { checkIsObjectId } from '../middlewares/checkParamMware';
import { checkReqBodyMware, testAddUserReqBody }
  from "../middlewares/checkReqBodyMware";

export const usersRouter = Router({});

const usersController = container.resolve(UsersController);

usersRouter.get('/',
  checkAuthMware,
  usersController.getUsers.bind(usersController)); //ok

usersRouter.post('/',
  checkAuthMware,
  testAddUserReqBody,
  checkReqBodyMware,
  usersController.createUser.bind(usersController)); //ok

usersRouter.delete('/:id',
  checkAuthMware,
  checkIsObjectId,
  usersController.deleteUser.bind(usersController)); //ok