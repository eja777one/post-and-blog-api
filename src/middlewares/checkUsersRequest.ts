import { ObjectId } from 'mongodb';
import { NextFunction, Request, Response } from "express";
import { usersRequestRepository } from '../repositories/07.usersDBRequest';

export const checkUsersRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const attemtsInterval = 10 * 1000
  const url = req.url
  const ip = req.ip
  const currentTime = new Date()
  // console.log(currentTime, 'current');
  const attemptTime = new Date(currentTime.getTime() - attemtsInterval)
  // console.log(attemptTime, 'attempt');


  const userLog = {
    _id: new ObjectId(),
    url,
    ip,
    createdAt: attemptTime
  };
  const usersRequests =
    await usersRequestRepository.getLogs(userLog);
  // console.log(usersRequests);

  await usersRequestRepository.addLog(userLog);
  if (usersRequests < 5) {
    next()
  } else {
    res.sendStatus(429)
  }
};