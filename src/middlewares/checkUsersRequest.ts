import { ObjectId } from 'mongodb';
import { NextFunction, Request, Response } from "express";
import { UsersRequestRepository }
  from '../features/users/infrastructure/usersReqDBRepo';

const usersRequestRepository = new UsersRequestRepository();

export const checkUsersRequest = async (req: Request, res: Response,
  next: NextFunction) => {

  const attemtsInterval = 10 * 1000;
  const currentTime = new Date();
  const attemptTime = new Date(currentTime.getTime() - attemtsInterval);

  const userLog = {
    _id: new ObjectId(),
    url: req.url,
    ip: req.ip,
    createdAt: currentTime
  };

  const usersRequests =
    await usersRequestRepository.getLogs(userLog, attemptTime);

  await usersRequestRepository.addLog(userLog);

  if (usersRequests < 5) next();
  else res.sendStatus(429);
};