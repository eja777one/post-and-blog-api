import { Router } from "express";
import { container } from "./00.compositionRoot";
import { BlogsController } from "../features/blogs/api/blogsController";
import { checkIsObjectId } from '../middlewares/checkParamMware';
import { checkAuthMware } from '../middlewares/checkAuthMware';
import {
  testBlogsReqBody,
  checkReqBodyMware,
  testPostsReqBodyNoBlogId
} from '../middlewares/checkReqBodyMware';
import { addOptionalUserInfo } from "../middlewares/authMware";

export const blogsRouter = Router({});

const blogsController = container.resolve(BlogsController);

blogsRouter.get('/:id',
  checkIsObjectId,
  blogsController.getBlog.bind(blogsController)); //ok

blogsRouter.get('/', blogsController.getBlogs.bind(blogsController)); //ok

blogsRouter.post('/',
  checkAuthMware,
  testBlogsReqBody,
  checkReqBodyMware,
  blogsController.createBlog.bind(blogsController)); //ok

blogsRouter.put('/:id',
  checkAuthMware,
  checkIsObjectId,
  testBlogsReqBody,
  checkReqBodyMware,
  blogsController.updateBlog.bind(blogsController)); //ok

blogsRouter.delete('/:id',
  checkAuthMware,
  checkIsObjectId,
  blogsController.deleteBlog.bind(blogsController));

blogsRouter.get('/:blogId/posts',
  addOptionalUserInfo,
  checkIsObjectId,
  blogsController.getBlogsPosts.bind(blogsController)); //ok

blogsRouter.post('/:blogId/posts',
  checkAuthMware,
  checkIsObjectId,
  testPostsReqBodyNoBlogId,
  checkReqBodyMware,
  blogsController.createBlogsPost.bind(blogsController)); //ok