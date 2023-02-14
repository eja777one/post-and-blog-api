import { inject, injectable } from 'inversify';
import { Request, Response } from "express";
import { prepareQueries } from '../../../application/prepareQuery';
import { UsersService } from '../application/usersService';
import { Paginator, UserInputModel, UserViewModel } from '../../../models';

@injectable()
export class UsersController {
  constructor(
    @inject(UsersService) protected usersService: UsersService
  ) { }

  async getUsers(req: Request, res: Response<Paginator<UserViewModel>>) {
    const query = prepareQueries(req.query);
    const result = await this.usersService.getUsers(query);
    res.status(result.statusCode).json(result.data); // TEST #4.2, #4.7, #4.15
  }

  async createUser(req: Request<UserInputModel>, res: Response<UserViewModel>) {
    const result = await this.usersService.createUser(req.body, req.ip);
    res.status(result.statusCode).json(result.data); // TEST #4.5, #4.6
  }

  async deleteUser(req: Request, res: Response) {
    const result = await this.usersService.deleteUser(req.params.id);
    res.sendStatus(result.statusCode); // TEST #4.
  }
};