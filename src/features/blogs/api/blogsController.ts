import { injectable, inject } from 'inversify';
import { Request, Response } from "express";
import { prepareQueries } from "../../../application/prepareQuery";
import { BlogsService } from "../application/blogsService";
import { PostsService } from "../../posts/application/postsService";
import {
  BlogInputModel,
  Paginator,
  BlogViewModel,
  PostViewModel,
  PostInputModelNoId
} from '../../../models';

@injectable()
export class BlogsController {
  constructor(
    @inject(BlogsService) protected blogService: BlogsService,
    @inject(PostsService) protected postsService: PostsService,
  ) { }

  async getBlog(req: Request<{ id: string }>,
    res: Response<BlogViewModel>) {
    const result = await this.blogService.getBlog(req.params.id);
    res.status(result.statusCode).json(result.data);
  }

  async getBlogs(req: Request, res: Response<Paginator<BlogViewModel>>) {
    const query = prepareQueries(req.query);
    const result = await this.blogService.getBlogs(query);
    res.status(result.statusCode).json(result.data);
  }

  async createBlog(req: Request<BlogInputModel>, res: Response<BlogViewModel>) {
    const result = await this.blogService.createBlog(req.body);
    res.status(result.statusCode).json(result.data);
  }

  async updateBlog(req: Request<{ id: string }, BlogInputModel>,
    res: Response) {
    const result = await this.blogService.updateBlog(req.params.id, req.body);
    res.sendStatus(result.statusCode);
  }

  async deleteBlog(req: Request<{ id: string }>, res: Response) {
    const result = await this.blogService.deleteBlog(req.params.id);
    res.sendStatus(result.statusCode);
  }

  async getBlogsPosts(req: Request<{ blogId: string }>,
    res: Response<Paginator<PostViewModel>>) {
    const query = prepareQueries(req.query);
    const result = await this.postsService
      .getBlogsPosts(query, req.params.blogId, req.user?.id);
    res.status(result.statusCode).json(result.data);
  }

  async createBlogsPost(req: Request<{ blogId: string }, PostInputModelNoId>,
    res: Response<PostViewModel>) {
    const result = await this.postsService
      .createBlogsPost(req.params.blogId, req.body);
    res.status(result.statusCode).json(result.data);
  }
};