import { Request, Response } from "express";
import { prepareQueries } from './../application/prepareQuery';
import { UsersService } from './../domains/05.usersService';
import { HTTP, Paginator, UserInputModel, UserViewModel } from '../models';

export class UsersController {
  constructor(protected usersService: UsersService) { }

  async getUsers(req: Request, res: Response<Paginator<UserViewModel>>) {
    const query = prepareQueries(req.query);
    const users = await this.usersService.getUsers(query);
    res.status(HTTP.OK_200).json(users); // TEST #4.2, #4.7, #4.15
  }

  async createUser(req: Request<UserInputModel>, res: Response<UserViewModel>) {
    const newUser = await this.usersService.createUser(req.body, req.ip);
    if (!newUser) return res.sendStatus(HTTP.NOT_FOUND_404);
    res.status(HTTP.CREATED_201).json(newUser); // TEST #4.5, #4.6
  }

  async deleteUser(req: Request, res: Response) {
    const deleted = await this.usersService.deleteUser(req.params.id);
    if (!deleted) return res.sendStatus(HTTP.NOT_FOUND_404);
    res.sendStatus(HTTP.NO_CONTENT_204); // TEST #4.
  }
};