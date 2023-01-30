import { Router, Request, Response } from "express";
import { checkIsObjectId } from '../middlewares/checkParamMware';
import { authMware } from '../middlewares/authMware';
import { checkReqBodyMware, testCommentBody } from '../middlewares/checkReqBodyMware';
import { commentsQueryRepository } from '../repositories/03.commentsQueryRepository';
import { commentsServices } from '../domains/03.commentsServices';
import { HTTP } from '../models';

export const commentsRouter = Router({});

commentsRouter.put('/:commentId',
  authMware,
  checkIsObjectId,
  testCommentBody,
  checkReqBodyMware,
  async (
    req: Request<{ commentId: string }>,
    res: Response
  ) => {

    if (!req.user) return res.sendStatus(HTTP.UNAUTHORIZED_401); // TEST #5.3

    const modified = await commentsServices
      .updateComment(req.params.commentId, req.user, req.body);

    res.sendStatus(HTTP[modified]);
  });

commentsRouter.delete('/:commentId',
  authMware,
  checkIsObjectId,
  async (
    req: Request<{ commentId: string }>,
    res: Response
  ) => {

    if (!req.user) return res.sendStatus(HTTP.UNAUTHORIZED_401);

    const deleted = await commentsServices
      .deleteComment(req.params.commentId, req.user);

    res.sendStatus(HTTP[deleted]);
  });

commentsRouter.get('/:commentId',
  checkIsObjectId,
  async (
    req: Request<{ commentId: string }>,
    res: Response
  ) => {
    const comment = await commentsQueryRepository
      .getComment(req.params.commentId);

    if (!comment) return res.sendStatus(HTTP.NOT_FOUND_404); // TEST #5.7, #5.12

    res.status(HTTP.OK_200).json(comment); // TEST #5.6
  });