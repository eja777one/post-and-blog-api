import { NextFunction, Request, Response } from "express";
import { jwtService } from '../application/jwt-service';
import { HTTP } from '../models';
import { UsersQueryRepository }
  from '../features/users/infrastructure/usersQRepo';

const usersQueryRepository = new UsersQueryRepository();

export const authMware = async (req: Request, res: Response,
  next: NextFunction) => {

  if (!req.headers.authorization) {
    return res.sendStatus(HTTP.UNAUTHORIZED_401);
  };

  const token = req.headers.authorization.split(' ')[1];

  const userId = await jwtService.getUserIdByToken(token);
  if (!userId) return res.sendStatus(HTTP.UNAUTHORIZED_401);

  const user = await usersQueryRepository.getUser(userId.toString());
  if (!user) return res.sendStatus(HTTP.UNAUTHORIZED_401);

  req.user = user;
  next();
};

export const addOptionalUserInfo = async (req: Request, res: Response,
  next: NextFunction) => {

  if (!req.headers.authorization) return next();

  const token = req.headers.authorization.split(' ')[1];

  const userId = await jwtService.getUserIdByToken(token);
  if (!userId) return next();

  const user = await usersQueryRepository.getUser(userId.toString());
  if (!user) return next();

  req.user = user;
  next();
};