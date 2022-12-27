import { NextFunction, Request, Response } from "express";
import { ObjectId } from 'mongodb'

export const checkIsObjectId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  const blogId = req.params.blogId;
  const reqId = id || blogId;
  if (ObjectId.isValid(reqId)) next();
  else res.sendStatus(404);
  // TEST #2.5, #2.7, #2.91, #2.93, #2.12, #3.5, #3.7, #3.12, #4.8
};