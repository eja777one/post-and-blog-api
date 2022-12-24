import { Request, Response, Router } from 'express';
import { postsServices } from './../domains/posts-services';
import { blogServices } from './../domains/blogs-services';
import { HTTP } from '../models';

export const testsRouter = Router({});

testsRouter.delete('/', async (req: Request, res: Response) => {
  await blogServices.deleteAll();
  await postsServices.deleteAll();
  res.sendStatus(HTTP.NO_CONTENT_204); // TEST #1.1
});