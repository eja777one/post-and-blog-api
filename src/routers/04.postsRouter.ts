import { Router, Request, Response } from "express";
import { postsQueryRepository } from '../repositories/04.postsQRepo';
import { commentsService } from '../domains/03.commentsService';
import { postsService } from '../domains/04.postsService';
import { authMware } from '../middlewares/authMware';
import { checkIsObjectId } from '../middlewares/checkParamMware';
import { checkAuthMware } from '../middlewares/checkAuthMware';
import { prepareQueries } from '../application/prepareQuery';
import { commentsQueryRepository } from '../repositories/03.commentsQRepo';
import { testPostsReqBody, checkReqBodyMware, testCommentBody }
  from '../middlewares/checkReqBodyMware';
import {
  PostInputModel,
  HTTP,
  PostViewModel,
  Paginator,
  CommentInputModel,
  CommentViewModel
} from '../models';

export const postsRouter = Router({});

class PostsController {

  async getPostsComments(req: Request,
    res: Response<Paginator<CommentViewModel>>) {

    const post = await postsQueryRepository.getPost(req.params.postId);
    if (!post) return res.sendStatus(HTTP.NOT_FOUND_404); // TEST #3.12

    const query = prepareQueries(req.query);

    const comments = await commentsQueryRepository
      .getComments(query, req.params.postId);

    res.status(HTTP.OK_200).json(comments); // TEST #3.13, #3.20
  }

  async createPostsComment(req: Request<{ postId: string }, CommentInputModel>,
    res: Response<CommentViewModel>) {

    if (!req.user) return res.sendStatus(HTTP.UNAUTHORIZED_401); // TEST #3.17

    const post = await postsQueryRepository.getPost(req.params.postId);
    if (!post) return res.sendStatus(HTTP.NOT_FOUND_404);

    const commentId = await commentsService
      .addComment(req.user!, req.params.postId, req.body);

    const comment = await commentsQueryRepository.getComment(commentId);
    if (!comment) return res.sendStatus(HTTP.NOT_FOUND_404);

    res.status(HTTP.CREATED_201).json(comment); // TEST #3.19
  }

  async getPosts(req: Request, res: Response<Paginator<PostViewModel>>) {
    const query = prepareQueries(req.query);
    const posts = await postsQueryRepository.getPosts(query);
    return res.status(200).json(posts); // TEST #3.1, #3.24
  }

  async createPost(req: Request/*<PostInputModel>*/, res: Response<PostViewModel>) {
    const postId = await postsService.createPost(req.body);
    if (!postId) return res.sendStatus(HTTP.NOT_FOUND_404);

    const post = await postsQueryRepository.getPost(postId);
    if (!post) return res.sendStatus(HTTP.NOT_FOUND_404);

    res.status(HTTP.CREATED_201).json(post); // TEST #2.4, #3.4
  }

  async getPost(req: Request<{ id: string }>, res: Response<PostViewModel>) {

    const post = await postsQueryRepository.getPost(req.params.id);
    if (!post) return res.sendStatus(HTTP.NOT_FOUND_404);

    res.status(HTTP.OK_200).json(post); // TEST #3.6, #3.11
  }

  async updatePost(req: Request<{ id: string }, PostInputModel>,
    res: Response) {

    const modified = await postsService.updatePost(req.params.id, req.body);
    if (!modified) return res.sendStatus(HTTP.NOT_FOUND_404);

    res.sendStatus(HTTP.NO_CONTENT_204); // TEST #3.10
  }

  async deletePost(req: Request<{ id: string }>, res: Response) {

    const deleted = await postsService.deletePost(req.params.id);
    if (!deleted) return res.sendStatus(HTTP.NOT_FOUND_404);

    res.sendStatus(HTTP.NO_CONTENT_204); // TEST #3.23
  }
};

const postsController = new PostsController();

postsRouter.get('/', postsController.getPosts);

postsRouter.get('/:postId/comments',
  checkIsObjectId,
  postsController.getPostsComments);

postsRouter.post('/:postId/comments',
  authMware,
  checkIsObjectId,
  testCommentBody,
  checkReqBodyMware,
  postsController.createPostsComment);

postsRouter.post('/',
  checkAuthMware,
  testPostsReqBody,
  checkReqBodyMware,
  postsController.createPost);

postsRouter.get('/:id',
  checkIsObjectId,
  postsController.getPost);

postsRouter.put('/:id',
  checkAuthMware,
  checkIsObjectId,
  testPostsReqBody,
  checkReqBodyMware,
  postsController.updatePost);

postsRouter.delete('/:id',
  checkAuthMware,
  checkIsObjectId,
  postsController.deletePost);