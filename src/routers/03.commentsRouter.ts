import { Router } from "express";
import { CommentsController } from "../features/comments/api/commentsController";
import { container } from "./00.compositionRoot";
import { checkIsObjectId } from '../middlewares/checkParamMware';
import { addOptionalUserInfo, authMware } from '../middlewares/authMware';
import { checkReqBodyMware, testCommentBody, testLikeCommentBody }
  from '../middlewares/checkReqBodyMware';

export const commentsRouter = Router({});

const commentsController = container.resolve(CommentsController);

commentsRouter.get('/:commentId',
  addOptionalUserInfo,
  checkIsObjectId,
  commentsController.getComment.bind(commentsController)); //ok

commentsRouter.put('/:commentId',
  authMware,
  checkIsObjectId,
  testCommentBody,
  checkReqBodyMware,
  commentsController.updateComment.bind(commentsController)); //ok

commentsRouter.delete('/:commentId',
  authMware,
  checkIsObjectId,
  commentsController.deleteComment.bind(commentsController)); //ok

commentsRouter.put('/:commentId/like-status',
  authMware,
  checkIsObjectId,
  testLikeCommentBody,
  checkReqBodyMware,
  commentsController.changeLikeStatus.bind(commentsController)); //ok