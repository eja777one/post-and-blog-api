import { HTTP } from '../models';
import { usersQueryRepository } from '../repositories/users-query-repository';
import { jwtService } from '../application/jwt-service';
import { NextFunction, Request, Response } from "express";

export const authMware = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers.authorization) {
    res.sendStatus(HTTP.UNAUTHORIZED_401); // TEST #3.17
    return;
  };

  const token = req.headers.authorization.split(' ')[1];
  const userId = await jwtService.getUserIdByToken(token);
  if (userId) {
    req.user = await usersQueryRepository.getUserById(userId.toString());
    next();
  } else {
    res.sendStatus(HTTP.UNAUTHORIZED_401); // TEST #5.3, #5.10
    return;
  };
};