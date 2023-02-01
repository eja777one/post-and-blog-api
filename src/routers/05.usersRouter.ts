import { Router, Request, Response } from "express";
import { checkAuthMware } from "../middlewares/checkAuthMware";
import { checkIsObjectId } from '../middlewares/checkParamMware';
import { usersQueryRepository } from '../repositories/05.usersQRepo';
import { usersService } from '../domains/05.usersService';
import { HTTP, UserInputModel, UserViewModel, Paginator } from "../models";
import { prepareQueries } from '../application/prepareQuery';
import { checkReqBodyMware, testAddUserReqBody }
  from "../middlewares/checkReqBodyMware";

export const usersRouter = Router({});

class UsersController {
  async getUsers(req: Request, res: Response<Paginator<UserViewModel>>) {
    const query = prepareQueries(req.query);
    const users = await usersQueryRepository.getUsers(query);
    res.status(HTTP.OK_200).json(users); // TEST #4.2, #4.7, #4.15
  }

  async createUser(req: Request<UserInputModel>, res: Response<UserViewModel>) {
    const newUserId = await usersService.createUser(req.body, req.ip);

    const user = await usersQueryRepository.getUser(newUserId);
    if (!user) return res.sendStatus(HTTP.NOT_FOUND_404);

    res.status(HTTP.CREATED_201).json(user); // TEST #4.5, #4.6
  }

  async deleteUser(req: Request, res: Response) {
    const deleted = await usersService.deleteUser(req.params.id);
    if (!deleted) return res.sendStatus(HTTP.NOT_FOUND_404);

    res.sendStatus(HTTP.NO_CONTENT_204); // TEST #4.
  }
};

const usersController = new UsersController();

usersRouter.get('/', checkAuthMware, usersController.getUsers);

usersRouter.post('/',
  checkAuthMware,
  testAddUserReqBody,
  checkReqBodyMware,
  usersController.createUser);

usersRouter.delete('/:id',
  checkAuthMware,
  checkIsObjectId,
  usersController.deleteUser);