import { NextFunction, Request, Response } from "express";
import { HTTP } from './../models';

export const checkCookie = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.cookies.refreshToken) {
    res.sendStatus(HTTP.UNAUTHORIZED_401);
  } else next();
};