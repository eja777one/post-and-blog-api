import { postsQueryRepository } from './../repositories/posts-query-repository';
import { Router, Request, Response } from "express";
import { testPostsReqBody, checkReqBodyMware } from '../middlewares/checkReqBodyMware';
import { checkIsObjectId } from '../middlewares/checkParamMware';
import { checkAuthMware } from '../middlewares/checkAuthMware';
import { postsServices } from './../domains/posts-services';
import { PostInputModel, HTTP, PostViewModel, Paginator } from '../models';
import { prepareQueries } from './mappers';

export const postsRouter = Router({});

postsRouter.get('/', async (
  req: Request,
  res: Response<Paginator<PostViewModel>>
) => {
  const query = prepareQueries(req.query);
  const posts = await postsQueryRepository.getPostsByQuery(query);
  return res.status(200).json(posts); // TEST #3.1, #3.15
});

postsRouter.post('/',
  checkAuthMware,
  testPostsReqBody, checkReqBodyMware,
  async (
    req: Request<PostInputModel>,
    res: Response<PostViewModel>
  ) => {
    const postId = await postsServices.createPost(req.body);
    const post = await postsQueryRepository.getPostById(postId);
    return res.status(HTTP.CREATED_201).json(post); // TEST #2.4
  });

postsRouter.get('/:id',
  checkIsObjectId,
  async (
    req: Request<{ id: string }>,
    res: Response<PostViewModel>
  ) => {
    const post = await postsQueryRepository.getPostById(req.params.id);
    res.status(HTTP.OK_200).json(post); // TEST #3.6, #3.11
  });

postsRouter.put('/:id',
  checkAuthMware,
  checkIsObjectId,
  testPostsReqBody, checkReqBodyMware,
  async (
    req: Request<{ id: string }, PostInputModel>,
    res: Response
  ) => {
    await postsServices.updatePost(req.params.id, req.body);
    res.sendStatus(HTTP.NO_CONTENT_204); // TEST #3.10
  });

postsRouter.delete('/:id',
  checkAuthMware,
  checkIsObjectId,
  async (req: Request<{ id: string }>, res: Response) => {
    const post = await postsServices.deletePostById(req.params.id);
    if (post) res.sendStatus(HTTP.NO_CONTENT_204); // TEST #3.14
    else res.sendStatus(HTTP.NOT_FOUND_404);
  });