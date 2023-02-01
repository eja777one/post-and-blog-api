import { Request, Response, Router } from 'express';
import { tokensMetaRepository } from '../repositories/06.tokensDBRepo';
import { usersRequestRepository } from '../repositories/07.usersReqDBRepo';
import { passwordRecoveryRepository }
  from '../repositories/08.passwordsRecDBRepo';
import { blogService } from '../domains/02.blogsService';
import { commentsService } from '../domains/03.commentsService';
import { postsService } from '../domains/04.postsService';
import { usersService } from '../domains/05.usersService';
import { HTTP } from '../models';

export const testsRouter = Router({});

class TestController {
  async deleteAllData(req: Request, res: Response) {
    await blogService.deleteAll();
    await postsService.deleteAll();
    await usersService.deleteAll();
    await commentsService.deleteAll();
    await usersRequestRepository.deleteAll();
    await tokensMetaRepository.deleteAll();
    await passwordRecoveryRepository.deleteAll();
    res.sendStatus(HTTP.NO_CONTENT_204); // TEST #1.1
  }
};

const testController = new TestController();

testsRouter.delete('/', testController.deleteAllData);