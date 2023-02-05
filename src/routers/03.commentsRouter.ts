import { Router } from "express";
import { commentsController } from "./00.compositionRoot";
import { checkIsObjectId } from '../middlewares/checkParamMware';
import { authMware } from '../middlewares/authMware';
import { checkReqBodyMware, testCommentBody, testLikeCommentBody }
  from '../middlewares/checkReqBodyMware';

export const commentsRouter = Router({});

commentsRouter.put('/:commentId',
  authMware,
  checkIsObjectId,
  testCommentBody,
  checkReqBodyMware,
  commentsController.updateComment.bind(commentsController));

commentsRouter.put('/:commentId/like-status',
  authMware,
  checkIsObjectId,
  testLikeCommentBody,
  checkReqBodyMware,
  commentsController.changeLikeStatus.bind(commentsController)
);

commentsRouter.delete('/:commentId',
  authMware,
  checkIsObjectId,
  commentsController.deleteComment.bind(commentsController));

commentsRouter.get('/:commentId',
  checkIsObjectId,
  commentsController.getComment.bind(commentsController));