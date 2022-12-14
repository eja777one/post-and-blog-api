import { Router, Request, Response } from "express";
import { testPostsReqBody, checkReqBodyMware, } from '../middlewares/checkReqBodyMware';
import { testPostsParam, checkParamMware } from '../middlewares/checkParamMware';
import { testBaseAuth, checkAuthMware } from '../middlewares/checkAuthMware';
import { postsRepository } from '../repositories/posts-repository';
import { HTTP } from '../HTTPStatusCodes';
import { PostInputModel } from '../models';

export const postsRouter = Router({});

postsRouter.get('/', (req: Request, res: Response) => {
  const posts = postsRepository.getPosts();
  res.status(200).json(posts); // TEST #3.1, #3.15
});

postsRouter.post('/',
  testBaseAuth, checkAuthMware,
  testPostsReqBody, checkReqBodyMware,
  (req: Request<PostInputModel>, res: Response) => {
    const post = postsRepository.createPost(req.body);
    res.status(HTTP.CREATED_201).json(post); // TEST #3.4
  });

postsRouter.get('/:id',
  testPostsParam, checkParamMware,
  (req: Request<{ id: string }>, res: Response) => {
    const post = postsRepository.getPostById(req.params.id);
    res.status(HTTP.OK_200).json(post); // TEST #3.6, #3.11
  });

postsRouter.put('/:id',
  testBaseAuth, checkAuthMware,
  testPostsParam, checkParamMware,
  testPostsReqBody, checkReqBodyMware,
  (req: Request<{ id: string }, PostInputModel>, res: Response) => {
    postsRepository.updatePost(req.params.id, req.body);
    res.sendStatus(HTTP.NO_CONTENT_204); // TEST #3.10
  });

postsRouter.delete('/:id',
  testBaseAuth, checkAuthMware,
  testPostsParam, checkParamMware,
  (req: Request<{ id: string }>, res: Response) => {
    postsRepository.deletePostById(req.params.id);
    res.sendStatus(HTTP.NO_CONTENT_204); // TEST #3.14
  });