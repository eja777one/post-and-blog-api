import { Request, Response, Router } from 'express';
import { TokensMetaRepository } from '../repositories/06.tokensDBRepo';
import { UsersRequestRepository } from '../repositories/07.usersReqDBRepo';
import { BlogsRepository } from '../repositories/02.blogsDBRepo';
import { PostsRepository } from '../repositories/04.postsDBRepo';
import { CommentsRepository } from '../repositories/03.commentsDBRepo';
import { UsersRepository } from '../repositories/05.usersDBRepo';
import { PasswordRecoveryRepository }
  from '../repositories/08.passwordsRecDBRepo';
import { HTTP } from '../models';

export const testsRouter = Router({});

class TestController {

  tokensMetaRepository: TokensMetaRepository;
  usersRequestRepository: UsersRequestRepository;
  passwordRecoveryRepository: PasswordRecoveryRepository;
  blogsRepository: BlogsRepository;
  postsRepository: PostsRepository;
  commentsRepository: CommentsRepository;
  usersRepository: UsersRepository;

  constructor() {
    this.tokensMetaRepository = new TokensMetaRepository();
    this.usersRequestRepository = new UsersRequestRepository();
    this.passwordRecoveryRepository = new PasswordRecoveryRepository();
    this.blogsRepository = new BlogsRepository();
    this.postsRepository = new PostsRepository();
    this.commentsRepository = new CommentsRepository();
    this.usersRepository = new UsersRepository();
  }

  async deleteAllData(req: Request, res: Response) {
    await this.blogsRepository.deleteAll();
    await this.postsRepository.deleteAll();
    await this.usersRepository.deleteAll();
    await this.commentsRepository.deleteAll();
    await this.usersRequestRepository.deleteAll();
    await this.tokensMetaRepository.deleteAll();
    await this.passwordRecoveryRepository.deleteAll();
    res.sendStatus(HTTP.NO_CONTENT_204); // TEST #1.1
  }
};

const testController = new TestController();

testsRouter.delete('/', testController.deleteAllData.bind(testController));