import { Router } from "express";
import { postsController } from "./00.compositionRoot";
import { addOptionalUserInfo, authMware } from '../middlewares/authMware';
import { checkIsObjectId } from '../middlewares/checkParamMware';
import { checkAuthMware } from '../middlewares/checkAuthMware';
import { testPostsReqBody, checkReqBodyMware, testCommentBody }
  from '../middlewares/checkReqBodyMware';

export const postsRouter = Router({});

postsRouter.get('/',
  postsController.getPosts.bind(postsController));

postsRouter.get('/:postId/comments',
  addOptionalUserInfo,
  checkIsObjectId,
  postsController.getPostsComments.bind(postsController));

postsRouter.post('/:postId/comments',
  authMware,
  checkIsObjectId,
  testCommentBody,
  checkReqBodyMware,
  postsController.createPostsComment.bind(postsController));

postsRouter.post('/',
  checkAuthMware,
  testPostsReqBody,
  checkReqBodyMware,
  postsController.createPost.bind(postsController));

postsRouter.get('/:id',
  checkIsObjectId,
  postsController.getPost.bind(postsController));

postsRouter.put('/:id',
  checkAuthMware,
  checkIsObjectId,
  testPostsReqBody,
  checkReqBodyMware,
  postsController.updatePost.bind(postsController));

postsRouter.delete('/:id',
  checkAuthMware,
  checkIsObjectId,
  postsController.deletePost.bind(postsController));