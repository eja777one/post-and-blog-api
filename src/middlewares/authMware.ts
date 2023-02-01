import { NextFunction, Request, Response } from "express";
import { jwtService } from '../application/jwt-service';
import { HTTP } from '../models';
import { usersQueryRepository }
  from '../repositories/05.usersQRepo';

export const authMware = async (
  req: Request,
  res: Response,
  next: NextFunction) => {

  if (!req.headers.authorization) {
    return res.sendStatus(HTTP.UNAUTHORIZED_401);
  };

  const token = req.headers.authorization.split(' ')[1];

  const userId = await jwtService.getUserIdByToken(token);

  if (!userId) return res.sendStatus(HTTP.UNAUTHORIZED_401);

  const user = await usersQueryRepository
    .getUser(userId.toString());

  if (!user) return res.sendStatus(HTTP.UNAUTHORIZED_401);

  req.user = user;
  next();
};