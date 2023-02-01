import { Router, Request, Response } from "express";
import { blogService } from '../domains/02.blogsService';
import { prepareQueries } from '../application/prepareQuery';
import { checkIsObjectId } from '../middlewares/checkParamMware';
import { checkAuthMware } from '../middlewares/checkAuthMware';
import { postsQueryRepository } from '../repositories/04.postsQRepo';
import { blogsQueryRepository } from '../repositories/02.blogsQRepo';
import {
  testBlogsReqBody,
  checkReqBodyMware,
  testPostsReqBodyNoBlogId
} from '../middlewares/checkReqBodyMware';
import {
  BlogInputModel,
  HTTP,
  Paginator,
  BlogViewModel,
  PostViewModel,
  PostInputModelNoId
} from '../models';

export const blogsRouter = Router({});

class BlogsController {

  async getBlogs(req: Request, res: Response<Paginator<BlogViewModel>>) {
    const query = prepareQueries(req.query);

    const blogs = await blogsQueryRepository.getBlogs(query);

    res.status(HTTP.OK_200).json(blogs); // TEST #2.1, #2.22
  }

  async createBlog(req: Request<BlogInputModel>, res: Response<BlogViewModel>) {
    const blogId = await blogService.createBlog(req.body);

    const blog = await blogsQueryRepository.getBlog(blogId);

    if (!blog) return res.sendStatus(HTTP.NOT_FOUND_404);

    res.status(HTTP.CREATED_201).json(blog); // TEST #2.4
  }

  async getBlogById(req: Request<{ id: string }>,
    res: Response<BlogViewModel>) {
    const blog = await blogsQueryRepository.getBlog(req.params.id);

    if (!blog) return res.sendStatus(HTTP.NOT_FOUND_404);

    res.status(HTTP.OK_200).json(blog); // TEST #2.6, #2.11
  }

  async updateBlog(req: Request<{ id: string }, BlogInputModel>,
    res: Response) {
    const updated = await blogService.updateBlog(req.params.id, req.body);

    if (!updated) return res.sendStatus(HTTP.NOT_FOUND_404);

    res.sendStatus(HTTP.NO_CONTENT_204); // TEST #2.10
  }

  async deleteBlog(req: Request<{ id: string }>, res: Response) {
    const deleted = await blogService.deleteBlog(req.params.id);

    if (!deleted) return res.sendStatus(HTTP.NOT_FOUND_404);

    res.sendStatus(HTTP.NO_CONTENT_204); // TEST #2.21
  }

  async getBlogsPosts(req: Request<{ blogId: string }>,
    res: Response<Paginator<PostViewModel>>) {
    const blog = await blogsQueryRepository.getBlog(req.params.blogId);

    if (!blog) return res.sendStatus(HTTP.NOT_FOUND_404);

    const query = prepareQueries(req.query);

    const posts = await postsQueryRepository.getPosts(query, req.params.blogId);

    res.status(HTTP.OK_200).json(posts); // TEST #2.13, #2.18
  }

  async createBlogsPost(req: Request<{ blogId: string }, PostInputModelNoId>,
    res: Response<PostViewModel>) {

    const postId = await blogService
      .createPostsByBlogId(req.params.blogId, req.body);

    if (!postId) return res.sendStatus(HTTP.NOT_FOUND_404);

    const post = await postsQueryRepository.getPost(postId);

    if (!post) return res.sendStatus(HTTP.NOT_FOUND_404);

    res.status(HTTP.CREATED_201).json(post); // TEST #2.17
  }
};

const blogsController = new BlogsController();

blogsRouter.get('/', blogsController.getBlogs);

blogsRouter.post('/',
  checkAuthMware,
  testBlogsReqBody,
  checkReqBodyMware,
  blogsController.createBlog);

blogsRouter.get('/:id',
  checkIsObjectId,
  blogsController.getBlogById);

blogsRouter.put('/:id',
  checkAuthMware,
  checkIsObjectId,
  testBlogsReqBody,
  checkReqBodyMware,
  blogsController.updateBlog);

blogsRouter.delete('/:id',
  checkAuthMware,
  checkIsObjectId,
  blogsController.deleteBlog);

blogsRouter.get('/:blogId/posts',
  checkIsObjectId,
  blogsController.getBlogsPosts);

blogsRouter.post('/:blogId/posts',
  checkAuthMware,
  checkIsObjectId,
  testPostsReqBodyNoBlogId,
  checkReqBodyMware,
  blogsController.createBlogsPost);