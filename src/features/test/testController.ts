import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { TokensMetaRepository } from '../devices/infrastructure/tokensDBRepo';
import { UsersRequestRepository } from '../users/infrastructure/usersReqDBRepo';
import { BlogsRepository } from '../blogs/infrastructure/blogsDBRepo';
import { PostsRepository } from '../posts/infrastructure/postsDBRepo';
import { CommentsRepository } from '../comments/infrastructure/commentsDBRepo';
import { UsersRepository } from '../users/infrastructure/usersDBRepo';
import { PasswordRecoveryRepository }
  from '../users/infrastructure/passwordsRecDBRepo';
import { HTTP } from '../../models';

@injectable()
export class TestController {
  constructor(
    @inject(TokensMetaRepository) protected tokensMetaRepository:
      TokensMetaRepository,
    @inject(UsersRequestRepository) protected usersRequestRepository:
      UsersRequestRepository,
    @inject(PasswordRecoveryRepository) protected passwordRecoveryRepository:
      PasswordRecoveryRepository,
    @inject(BlogsRepository) protected blogsRepository: BlogsRepository,
    @inject(PostsRepository) protected postsRepository: PostsRepository,
    @inject(CommentsRepository) protected commentsRepository: CommentsRepository,
    @inject(UsersRepository) protected usersRepository: UsersRepository,) { }

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