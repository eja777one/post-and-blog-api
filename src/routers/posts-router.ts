import { Router, Request, Response } from "express";
import { testPostsReqBody, checkReqBodyMware } from '../middlewares/checkReqBodyMware';
import { testPostsParam, checkParamMware } from '../middlewares/checkParamMware';
import { testBaseAuth, checkAuthMware } from '../middlewares/checkAuthMware';
import { postsServices } from './../domains/posts-services';
import { PostInputModel, HTTP, PostViewModel, Paginator } from '../models';
import { prepareQueries, preparePosts, preparePost } from './mappers';

export const postsRouter = Router({});

postsRouter.get('/', async (
  req: Request,
  res: Response<Paginator<PostViewModel>>
) => {
  const query = prepareQueries(req.query);
  const posts = await postsServices.getPostsByQuery(query);
  const formatPosts = preparePosts(posts);

  return res.status(200).json(formatPosts); // TEST #3.1, #3.15
});

postsRouter.post('/',
  testBaseAuth, checkAuthMware,
  testPostsReqBody, checkReqBodyMware,
  async (
    req: Request<PostInputModel>,
    res: Response<PostViewModel>
  ) => {
    const post = await postsServices.createPost(req.body);
    if (post) {
      const formatPost = preparePost(post);
      return res.status(HTTP.CREATED_201).json(formatPost); // TEST #2.4
    };
  });

postsRouter.get('/:id',
  testPostsParam, checkParamMware,
  async (
    req: Request<{ id: string }>,
    res: Response<PostViewModel>
  ) => {
    const post = await postsServices.getPostById(req.params.id);
    if (post) {
      const formatPost = preparePost(post);
      res.status(HTTP.OK_200).json(formatPost); // TEST #3.6, #3.11
    };
  });

postsRouter.put('/:id',
  testBaseAuth, checkAuthMware,
  testPostsParam, checkParamMware,
  testPostsReqBody, checkReqBodyMware,
  async (
    req: Request<{ id: string }, PostInputModel>,
    res: Response
  ) => {
    await postsServices.updatePost(req.params.id, req.body);
    res.sendStatus(HTTP.NO_CONTENT_204); // TEST #3.10
  });

postsRouter.delete('/:id',
  testBaseAuth, checkAuthMware,
  testPostsParam, checkParamMware,
  async (req: Request<{ id: string }>, res: Response) => {
    await postsServices.deletePostById(req.params.id);
    res.sendStatus(HTTP.NO_CONTENT_204); // TEST #3.14
  });