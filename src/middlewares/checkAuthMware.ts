import { NextFunction, Request, Response } from "express";
import { header, validationResult } from "express-validator";

export const testBaseAuth = header('authorization')
  .isIn(['Basic YWRtaW46cXdlcnR5']);

export const checkAuthMware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(401); // TEST #2.2, #2.8, #2.13, #3.2, #3.8, #3.13
  } else next();
};