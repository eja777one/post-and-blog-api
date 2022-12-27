import { Router, Request, Response } from "express";
import { checkAuthMware } from "../middlewares/checkAuthMware";
import { checkReqBodyMware, testAddUserReqBody } from "../middlewares/checkReqBodyMware";
import { checkIsObjectId } from '../middlewares/checkParamMware';
import { usersQueryRepository } from './../repositories/users-query-repository';
import { usersServices } from './../domains/users-services';
import { HTTP, UserInputModel, UserViewModel, Paginator } from "../models";
import { prepareQueries } from './mappers';

export const usersRouter = Router({});
usersRouter.get('/',
  checkAuthMware,
  async (
    req: Request,
    res: Response<Paginator<UserViewModel>>
  ) => {
    const query = prepareQueries(req.query);
    const users = await usersQueryRepository
      .getUsersByQuery(query);
    res.status(HTTP.OK_200).json(users); // TEST #4.2, #4.7, #4.15
  });

usersRouter.post('/',
  checkAuthMware,
  testAddUserReqBody,
  checkReqBodyMware,
  async (
    req: Request<UserInputModel>,
    res: Response<UserViewModel>
  ) => {
    const newUserId = await usersServices.createUser(req.body);
    const user = await usersQueryRepository.getUserById(newUserId);
    res.status(201).json(user); // TEST #4.5, #4.6
  });

usersRouter.delete('/:id',
  checkAuthMware,
  checkIsObjectId,
  async (req: Request, res: Response) => {
    const result = await usersServices.deleteUserById(req.params.id);
    if (result)
      res.sendStatus(HTTP.NO_CONTENT_204); // TEST #4.
    else
      res.sendStatus(HTTP.NOT_FOUND_404);
  });