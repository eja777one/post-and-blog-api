import { commentsServices } from '../domains/03.commentsServices';
import { Request, Response, Router } from 'express';
import { usersServices } from '../domains/05.usersServices';
import { postsServices } from '../domains/04.postsServices';
import { blogServices } from '../domains/02.blogsServices';
import { HTTP } from '../models';

export const testsRouter = Router({});

testsRouter.delete('/', async (req: Request, res: Response) => {
  await blogServices.deleteAll();
  await postsServices.deleteAll();
  await usersServices.deleteAll();
  await commentsServices.deleteAll();
  res.sendStatus(HTTP.NO_CONTENT_204); // TEST #1.1
});