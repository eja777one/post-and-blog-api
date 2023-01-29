import { ObjectID } from 'bson';
import { HTTP } from './../models';
import { NextFunction, Request, Response } from "express";
import { usersRequestRepository } from '../repositories/07.usersDBRequest';

export const checkUsersRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const url = req.protocol + '://' + req.get('host') + req.originalUrl;

  const ip = req.headers['x-forwarded-for']
    || req.socket.remoteAddress
    || null;

  const createdAt = new Date().toISOString();

  const userLog = {
    _id: new ObjectID(),
    url,
    ip,
    createdAt
  };

  const addLog = await usersRequestRepository.addLog(userLog);

  const usersRequests =
    await usersRequestRepository.getLogs(userLog);

  if (usersRequests.length < 6) next();
  else {
    const timeStampArr0 =
      new Date(usersRequests[0].createdAt).getTime();
    const timeStampArr5 =
      new Date(usersRequests[5].createdAt).getTime();

    const diff = timeStampArr0 - timeStampArr5;

    const seconds = Math.floor(diff / 1000 % 60);

    console.log(seconds);

    if (seconds < 10 && usersRequests.length > 5) {
      res.sendStatus(HTTP.TOO_MANY_REQUESTS_429)
      return;
    } else {
      // await usersRequestRepository.deleteLogs(userLog);
      next();
    }
  }
};