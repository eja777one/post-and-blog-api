import { ObjectId } from 'mongodb';
import { NextFunction, Request, Response } from "express";
import { usersRequestRepository } from '../repositories/07.usersDBRequestRepository';

export const checkUsersRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const attemtsInterval = 10 * 1000; // 10 sec
  const currentTime = new Date(); // текущая дата и время
  console.log(currentTime, 'current');
  const attemptTime = new Date(currentTime.getTime() - attemtsInterval); // дата и время за 10 сек до текущей
  console.log(attemptTime, 'attempt');
  console.log(attemptTime.getTime(), 'attempt');

  // const userLog = {
  //   _id: new ObjectId(),
  //   url: req.url,
  //   ip: req.ip,
  //   createdAt: attemptTime
  // };

  const userLog = {
    _id: new ObjectId(),
    url: req.url,
    ip: req.ip,
    createdAt: currentTime
  };

  const usersRequests =
    await usersRequestRepository.getLogs(userLog, attemptTime);

  await usersRequestRepository.addLog(userLog);

  // console.log(usersRequests)

  if (usersRequests < 5) {
    next()
  } else {
    res.sendStatus(429)
  }
};