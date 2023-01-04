import { commentsServices } from './../domains/comments-services';
import { Request, Response, Router } from 'express';
import { usersServices } from './../domains/users-services';
import { postsServices } from './../domains/posts-services';
import { blogServices } from './../domains/blogs-services';
import { HTTP } from '../models';

export const testsRouter = Router({});

testsRouter.delete('/', async (req: Request, res: Response) => {
  await blogServices.deleteAll();
  await postsServices.deleteAll();
  await usersServices.deleteAll();
  await commentsServices.deleteAll();
  res.sendStatus(HTTP.NO_CONTENT_204); // TEST #1.1
});