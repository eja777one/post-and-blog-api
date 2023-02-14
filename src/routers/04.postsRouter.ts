import { Router } from "express";
import { container } from "./00.compositionRoot";
import { PostsController } from "../features/posts/api/postController";
import { addOptionalUserInfo, authMware } from '../middlewares/authMware';
import { checkIsObjectId } from '../middlewares/checkParamMware';
import { checkAuthMware } from '../middlewares/checkAuthMware';
import { testPostsReqBody, checkReqBodyMware, testCommentBody, testLikeCommentBody }
  from '../middlewares/checkReqBodyMware';

export const postsRouter = Router({});

const postsController = container.resolve(PostsController);

postsRouter.get('/:id',
  addOptionalUserInfo,
  checkIsObjectId,
  postsController.getPost.bind(postsController)); //ok

postsRouter.get('/',
  addOptionalUserInfo,
  postsController.getPosts.bind(postsController)); //ok

postsRouter.post('/',
  checkAuthMware,
  testPostsReqBody,
  checkReqBodyMware,
  postsController.createPost.bind(postsController)); //ok

postsRouter.put('/:id',
  checkAuthMware,
  checkIsObjectId,
  testPostsReqBody,
  checkReqBodyMware,
  postsController.updatePost.bind(postsController)); //ok

postsRouter.delete('/:id',
  checkAuthMware,
  checkIsObjectId,
  postsController.deletePost.bind(postsController)); //ok

postsRouter.put('/:postId/like-status',
  authMware,
  checkIsObjectId,
  testLikeCommentBody,
  checkReqBodyMware,
  postsController.changeLikeStatus.bind(postsController));

postsRouter.get('/:postId/comments',
  addOptionalUserInfo,
  checkIsObjectId,
  postsController.getPostsComments.bind(postsController)); //ok

postsRouter.post('/:postId/comments',
  authMware,
  checkIsObjectId,
  testCommentBody,
  checkReqBodyMware,
  postsController.createPostsComment.bind(postsController)); //ok