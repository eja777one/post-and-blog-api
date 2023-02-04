import { Router, Request, Response } from "express";
import { BlogService } from '../domains/02.blogsService';
import { PostsService } from './../domains/04.postsService';
import { prepareQueries } from '../application/prepareQuery';
import { checkIsObjectId } from '../middlewares/checkParamMware';
import { checkAuthMware } from '../middlewares/checkAuthMware';
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

  blogService: BlogService;
  postsService: PostsService;

  constructor() {
    this.blogService = new BlogService();
    this.postsService = new PostsService();
  }

  async getBlog(req: Request<{ id: string }>,
    res: Response<BlogViewModel>) {
    const blog = await this.blogService.getBlog(req.params.id);
    if (!blog) return res.sendStatus(HTTP.NOT_FOUND_404);
    res.status(HTTP.OK_200).json(blog); // TEST #2.6, #2.11
  }

  async getBlogs(req: Request, res: Response<Paginator<BlogViewModel>>) {
    const query = prepareQueries(req.query);
    const blogs = await this.blogService.getBlogs(query);
    res.status(HTTP.OK_200).json(blogs); // TEST #2.1, #2.22
  }

  async createBlog(req: Request<BlogInputModel>, res: Response<BlogViewModel>) {
    const blog = await this.blogService.createBlog(req.body);
    if (!blog) return res.sendStatus(HTTP.NOT_FOUND_404);
    res.status(HTTP.CREATED_201).json(blog); // TEST #2.4
  }

  async updateBlog(req: Request<{ id: string }, BlogInputModel>,
    res: Response) {
    const updated = await this.blogService.updateBlog(req.params.id, req.body);
    if (!updated) return res.sendStatus(HTTP.NOT_FOUND_404);
    res.sendStatus(HTTP.NO_CONTENT_204); // TEST #2.10
  }

  async deleteBlog(req: Request<{ id: string }>, res: Response) {
    const deleted = await this.blogService.deleteBlog(req.params.id);
    if (!deleted) return res.sendStatus(HTTP.NOT_FOUND_404);
    res.sendStatus(HTTP.NO_CONTENT_204); // TEST #2.21
  }

  async getBlogsPosts(req: Request<{ blogId: string }>,
    res: Response<Paginator<PostViewModel>>) {
    const query = prepareQueries(req.query);
    const posts = await this.postsService
      .getBlogsPosts(query, req.params.blogId);
    if (!posts) return res.sendStatus(HTTP.NOT_FOUND_404);
    res.status(HTTP.OK_200).json(posts); // TEST #2.13, #2.18
  }

  async createBlogsPost(req: Request<{ blogId: string }, PostInputModelNoId>,
    res: Response<PostViewModel>) {
    const post = await this.postsService
      .createBlogsPost(req.params.blogId, req.body);
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