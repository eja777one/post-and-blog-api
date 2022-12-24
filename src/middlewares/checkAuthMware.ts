import { NextFunction, Request, Response } from "express";
import { header, validationResult } from "express-validator";

const byffer = new Buffer(`${'admin'}:${'qwerty'}`)
const base64 = byffer.toString('base64')

export const testBaseAuth = header('authorization')
  .isIn([`Basic ${base64}`]);

export const checkAuthMware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(401); // TEST #2.2, #2.8, #2.93, #2.13, #3.2, #3.8, #3.13
  } else next();
};