import { Request, Response } from "express";
import { prepareQueries } from './../application/prepareQuery';
import { CommentsService } from './../domains/03.commentsService';
import { PostsService } from './../domains/04.postsService';
import {
  CommentInputModel,
  CommentViewModel,
  HTTP,
  Paginator,
  PostInputModel,
  PostViewModel
} from "../models";

export class PostsController {
  constructor(
    protected postsService: PostsService,
    protected commentsService: CommentsService,) { }

  async getPost(req: Request<{ id: string }>, res: Response<PostViewModel>) {
    const post = await this.postsService.getPost(req.params.id);
    if (!post) return res.sendStatus(HTTP.NOT_FOUND_404);
    res.status(HTTP.OK_200).json(post); // TEST #3.6, #3.11
  }

  async getPosts(req: Request, res: Response<Paginator<PostViewModel>>) {
    const query = prepareQueries(req.query);
    const posts = await this.postsService.getPosts(query);
    return res.status(200).json(posts); // TEST #3.1, #3.24
  }

  async getPostsComments(req: Request,
    res: Response<Paginator<CommentViewModel>>) {

    const query = prepareQueries(req.query);
    const postsComments = await this.postsService
      .getPostsComments(query, req.params.postId);

    if (!postsComments) return res.sendStatus(HTTP.NOT_FOUND_404); // TEST #3.12
    res.status(HTTP.OK_200).json(postsComments); // TEST #3.13, #3.20
  }

  async createPostsComment(req: Request<{ postId: string }, CommentInputModel>,
    res: Response<CommentViewModel>) {

    if (!req.user) return res.sendStatus(HTTP.UNAUTHORIZED_401); // TEST #3.17

    const comment = await this.commentsService
      .addComment(req.user!, req.params.postId, req.body);

    if (!comment) return res.sendStatus(HTTP.NOT_FOUND_404);
    res.status(HTTP.CREATED_201).json(comment); // TEST #3.19
  }

  async createPost(req: Request<{}, PostInputModel>,
    res: Response<PostViewModel>) {
    const post = await this.postsService.createPost(req.body);
    if (!post) return res.sendStatus(HTTP.NOT_FOUND_404);
    res.status(HTTP.CREATED_201).json(post); // TEST #2.4, #3.4
  }

  async updatePost(req: Request<{ id: string }, PostInputModel>,
    res: Response) {

    const modified = await this.postsService.updatePost(req.params.id, req.body);
    if (!modified) return res.sendStatus(HTTP.NOT_FOUND_404);
    res.sendStatus(HTTP.NO_CONTENT_204); // TEST #3.10
  }

  async deletePost(req: Request<{ id: string }>, res: Response) {
    const deleted = await this.postsService.deletePost(req.params.id);
    if (!deleted) return res.sendStatus(HTTP.NOT_FOUND_404);
    res.sendStatus(HTTP.NO_CONTENT_204); // TEST #3.23
  }
};