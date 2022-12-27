import { NextFunction, Request, Response } from "express";

export const checkAuthMware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const byffer = new Buffer(`${'admin'}:${'qwerty'}`);
  const base64 = byffer.toString('base64');

  const pass = req.header('authorization');
  pass === `Basic ${base64}` ? next() : res.sendStatus(401);
  // TEST #2.2, #2.8, #2.93, #2.13, #3.2, #3.8, #3.13, #4.1, #4.3, #4.9
};