import { HTTP } from '../models';
import { NextFunction, Request, Response } from "express";

export const allowedMethods = async (req: Request, res: Response, next: NextFunction) => {
  // NOTE: Exclude TRACE and TRACK methods to avoid XST attacks.
  const allowedMethods = [
    "OPTIONS",
    "HEAD",
    "CONNECT",
    "GET",
    "POST",
    "PUT",
    "DELETE",
    "PATCH",
  ];

  if (!allowedMethods.includes(req.method)) {
    res.status(HTTP.METHOD_NOT_ALLOWED_405)
      .send(`${req.method} not allowed.`);
  }

  next();
};