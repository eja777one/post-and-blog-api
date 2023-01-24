import { commentsServices } from '../domains/03.commentsServices';
import { Request, Response, Router } from 'express';
import { usersServices } from '../domains/05.usersServices';
import { postsServices } from '../domains/04.postsServices';
import { blogServices } from '../domains/02.blogsServices';
import { HTTP } from '../models';
import { usersRequestRepository } from '../repositories/07.usersDBRequest';
import { tokensMetaRepository } from '../repositories/06.tokensDBRepository';

export const testsRouter = Router({});

testsRouter.delete('/', async (req: Request, res: Response) => {
  await blogServices.deleteAll();
  await postsServices.deleteAll();
  await usersServices.deleteAll();
  await commentsServices.deleteAll();
  await usersRequestRepository.deleteAll();
  await tokensMetaRepository.deleteAll();
  res.sendStatus(HTTP.NO_CONTENT_204); // TEST #1.1
});