import { NextFunction, Request, Response } from "express";
import { ObjectId } from 'mongodb'

export const checkIsObjectId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  const blogId = req.params.blogId;
  const postId = req.params.postId;
  const commentId = req.params.commentId;
  const reqId = id || blogId || postId || commentId;
  if (ObjectId.isValid(reqId)) next();
  else res.sendStatus(404);
  // TEST #2.5, #2.7, #2.12, #2.14, #2.19, #3.5, #3.7, #3.12, #3.16, #3.21, #4.8
};