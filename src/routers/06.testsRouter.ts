import { Request, Response, Router } from 'express';
import { tokensMetaRepository } from '../repositories/06.tokensDBRepository';
import { usersRequestRepository } from '../repositories/07.usersDBRequestRepository';
import { passwordRecoveryRepository } from './../repositories/08.passwordsRecoveryDBRepositury';
import { blogServices } from '../domains/02.blogsServices';
import { commentsServices } from '../domains/03.commentsServices';
import { postsServices } from '../domains/04.postsServices';
import { usersServices } from '../domains/05.usersServices';
import { HTTP } from '../models';

export const testsRouter = Router({});

testsRouter.delete('/', async (req: Request, res: Response) => {
  await blogServices.deleteAll();
  await postsServices.deleteAll();
  await usersServices.deleteAll();
  await commentsServices.deleteAll();
  await usersRequestRepository.deleteAll();
  await tokensMetaRepository.deleteAll();
  await passwordRecoveryRepository.deleteAll();
  res.sendStatus(HTTP.NO_CONTENT_204); // TEST #1.1
});