import { Router } from "express";
import { blogsController } from "./00.compositionRoot";
import { checkIsObjectId } from '../middlewares/checkParamMware';
import { checkAuthMware } from '../middlewares/checkAuthMware';
import {
  testBlogsReqBody,
  checkReqBodyMware,
  testPostsReqBodyNoBlogId
} from '../middlewares/checkReqBodyMware';

export const blogsRouter = Router({});

blogsRouter.get('/', blogsController.getBlogs.bind(blogsController));

blogsRouter.post('/',
  checkAuthMware,
  testBlogsReqBody,
  checkReqBodyMware,
  blogsController.createBlog.bind(blogsController));

blogsRouter.get('/:id',
  checkIsObjectId,
  blogsController.getBlog.bind(blogsController));

blogsRouter.put('/:id',
  checkAuthMware,
  checkIsObjectId,
  testBlogsReqBody,
  checkReqBodyMware,
  blogsController.updateBlog.bind(blogsController));

blogsRouter.delete('/:id',
  checkAuthMware,
  checkIsObjectId,
  blogsController.deleteBlog.bind(blogsController));

blogsRouter.get('/:blogId/posts',
  checkIsObjectId,
  blogsController.getBlogsPosts.bind(blogsController));

blogsRouter.post('/:blogId/posts',
  checkAuthMware,
  checkIsObjectId,
  testPostsReqBodyNoBlogId,
  checkReqBodyMware,
  blogsController.createBlogsPost.bind(blogsController));