import { Router, Request, Response } from "express";
import { commentsQueryRepository } from '../repositories/03.commentsQueryRepository';
import { postsQueryRepository } from '../repositories/04.postsQueryRepository';
import { commentsServices } from '../domains/03.commentsServices';
import { postsServices } from '../domains/04.postsServices';
import { authMware } from '../middlewares/authMware';
import { testPostsReqBody, checkReqBodyMware, testCommentBody } from '../middlewares/checkReqBodyMware';
import { checkIsObjectId } from '../middlewares/checkParamMware';
import { checkAuthMware } from '../middlewares/checkAuthMware';
import { PostInputModel, HTTP, PostViewModel, Paginator, CommentInputModel, CommentViewModel } from '../models';
import { prepareQueries } from '../application/prepareQuery';

export const postsRouter = Router({});

postsRouter.get('/:postId/comments',
  checkIsObjectId,
  async (
    req: Request,
    res: Response<Paginator<CommentViewModel>>
  ) => {
    const post = await postsQueryRepository.getPostById(req.params.postId);
    if (!post) {
      res.sendStatus(HTTP.NOT_FOUND_404); // TEST #3.12
      return;
    };
    const query = prepareQueries(req.query);
    const comments = await commentsQueryRepository.getCommentByQuery(query, req.params.postId);
    res.status(HTTP.OK_200).json(comments); // TEST #3.13, #3.20
  });

postsRouter.post('/:postId/comments',
  authMware,
  checkIsObjectId,
  testCommentBody,
  checkReqBodyMware,
  async (
    req: Request<{ postId: string }, CommentInputModel>,
    res: Response<CommentViewModel>
  ) => {
    if (!req.user) {
      res.sendStatus(HTTP.UNAUTHORIZED_401); // TEST #3.17
      return;
    };
    const post = await postsQueryRepository.getPostById(req.params.postId);
    if (!post) {
      res.sendStatus(HTTP.NOT_FOUND_404);
      return;
    };
    const commentId = await commentsServices.addComment(req.user!, req.params.postId, req.body);
    const comment = await commentsQueryRepository.getComment(commentId);
    if (comment) res.status(HTTP.CREATED_201).json(comment); // TEST #3.19
  });

postsRouter.get('/', async (
  req: Request,
  res: Response<Paginator<PostViewModel>>
) => {
  const query = prepareQueries(req.query);
  const posts = await postsQueryRepository.getPostsByQuery(query);
  return res.status(200).json(posts); // TEST #3.1, #3.24
});

postsRouter.post('/',
  checkAuthMware,
  testPostsReqBody,
  checkReqBodyMware,
  async (
    req: Request<PostInputModel>,
    res: Response<PostViewModel>
  ) => {
    const postId = await postsServices.createPost(req.body);
    if (postId) {
      const post = await postsQueryRepository.getPostById(postId);
      if (post) res.status(HTTP.CREATED_201).json(post); // TEST #2.4, #3.4
    };
  });

postsRouter.get('/:id',
  checkIsObjectId,
  async (
    req: Request<{ id: string }>,
    res: Response<PostViewModel>
  ) => {
    const post = await postsQueryRepository.getPostById(req.params.id);
    if (post) res.status(HTTP.OK_200).json(post); // TEST #3.6, #3.11
    else res.sendStatus(HTTP.NOT_FOUND_404);
  });

postsRouter.put('/:id',
  checkAuthMware,
  checkIsObjectId,
  testPostsReqBody,
  checkReqBodyMware,
  async (
    req: Request<{ id: string }, PostInputModel>,
    res: Response
  ) => {
    const modified = await postsServices.updatePost(req.params.id, req.body);
    if (modified) res.sendStatus(HTTP.NO_CONTENT_204); // TEST #3.10
    else res.sendStatus(HTTP.NOT_FOUND_404);
  });

postsRouter.delete('/:id',
  checkAuthMware,
  checkIsObjectId,
  async (req: Request<{ id: string }>, res: Response) => {
    const post = await postsServices.deletePostById(req.params.id);
    if (post) res.sendStatus(HTTP.NO_CONTENT_204); // TEST #3.23
    else res.sendStatus(HTTP.NOT_FOUND_404);
  });