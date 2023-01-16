import { Router, Request, Response } from "express";
import { commentsQueryRepository } from '../repositories/03.commentsQueryRepository';
import { commentsServices } from '../domains/03.commentsServices';
import { HTTP } from '../models';
import { checkIsObjectId } from '../middlewares/checkParamMware';
import { authMware } from '../middlewares/authMware';
import { checkReqBodyMware, testCommentBody } from '../middlewares/checkReqBodyMware';

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
    if (!req.user) {
      res.sendStatus(HTTP.UNAUTHORIZED_401); // TEST #5.3
      return;
    };
    const modified = await commentsServices.updateComment(req.params.commentId, req.user, req.body);
    if (modified === '404') res.sendStatus(HTTP.NOT_FOUND_404); // TEST #5.1
    if (modified === '403') res.sendStatus(HTTP.FORBIDDEN_403); // TEST #5.2
    if (modified === '204') res.sendStatus(HTTP.NO_CONTENT_204); // TEST #5.5
  });

commentsRouter.delete('/:commentId',
  authMware,
  checkIsObjectId,
  async (
    req: Request<{ commentId: string }>,
    res: Response
  ) => {
    if (!req.user) {
      res.sendStatus(HTTP.UNAUTHORIZED_401);
      return;
    };
    const deleted = await commentsServices.deleteComment(req.params.commentId, req.user)

    if (deleted === '404') res.sendStatus(HTTP.NOT_FOUND_404); // TEST #5.8
    if (deleted === '403') res.sendStatus(HTTP.FORBIDDEN_403); // TEST #5.9
    if (deleted === '204') res.sendStatus(HTTP.NO_CONTENT_204); // TEST #5.11
  });

commentsRouter.get('/:commentId',
  checkIsObjectId,
  async (
    req: Request<{ commentId: string }>,
    res: Response
  ) => {
    const comment = await commentsQueryRepository.getComment(req.params.commentId);
    if (comment) res.status(HTTP.OK_200).json(comment); // TEST #5.6
    else res.sendStatus(HTTP.NOT_FOUND_404) // TEST #5.7, #5.12
  });