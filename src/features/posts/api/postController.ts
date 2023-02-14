import { inject, injectable } from 'inversify';
import { Request, Response } from "express";
import { prepareQueries } from '../../../application/prepareQuery';
import { CommentsService } from '../../comments/application/commentsService';
import { PostsService } from '../application/postsService';
import {
  CommentInputModel,
  CommentViewModel,
  LikeInputModel,
  Paginator,
  PostInputModel,
  PostViewModel
} from "../../../models";

@injectable()
export class PostsController {
  constructor(
    @inject(PostsService) protected postsService: PostsService,
    @inject(CommentsService) protected commentsService: CommentsService,
  ) { }

  async getPost(req: Request<{ id: string }>, res: Response<PostViewModel>) {
    const result = await this.postsService.getPost(req.params.id, req.user?.id);
    res.status(result.statusCode).json(result.data);
  }

  async getPosts(req: Request, res: Response<Paginator<PostViewModel>>) {
    const query = prepareQueries(req.query);
    const result = await this.postsService.getPosts(query, req.user?.id);
    res.status(result.statusCode).json(result.data);
  }

  async createPost(req: Request<{}, PostInputModel>,
    res: Response<PostViewModel>) {
    const result = await this.postsService.createPost(req.body);
    res.status(result.statusCode).json(result.data);
  }

  async updatePost(req: Request<{ id: string }, PostInputModel>,
    res: Response) {
    const result = await this.postsService.updatePost(req.params.id, req.body);
    res.status(result.statusCode).json(result.data);
  }

  async deletePost(req: Request<{ id: string }>, res: Response) {
    const result = await this.postsService.deletePost(req.params.id);
    res.status(result.statusCode).json(result.data);
  }

  async changeLikeStatus(req: Request<{ postId: string }, LikeInputModel>,
    res: Response) {
    const result = await this.postsService.changeLikeStatus(req.params.postId,
      req.body.likeStatus, req.user!.id, req.user!.login);
    res.sendStatus(result.statusCode);
  }

  async getPostsComments(req: Request,
    res: Response<Paginator<CommentViewModel>>) {
    const query = prepareQueries(req.query);

    const result = await this.postsService
      .getPostsComments(query, req.params.postId, req.user?.id);

    res.status(result.statusCode).json(result.data);
  }

  async createPostsComment(req: Request<{ postId: string }, CommentInputModel>,
    res: Response<CommentViewModel>) {
    const result = await this.commentsService
      .addComment(req.user!, req.params.postId, req.body);
    res.status(result.statusCode).json(result.data);
  }
};