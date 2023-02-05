import { BlogsRepository } from '../repositories/02.blogsDBRepo';
import { BlogsQueryRepository } from '../repositories/02.blogsQRepo';
import { CommentsRepository } from '../repositories/03.commentsDBRepo';
import { CommentsQueryRepository } from '../repositories/03.commentsQRepo';
import { PostsRepository } from '../repositories/04.postsDBRepo';
import { PostsQueryRepository } from '../repositories/04.postsQRepo';
import { UsersRepository } from './../repositories/05.usersDBRepo';
import { UsersQueryRepository } from './../repositories/05.usersQRepo';
import { TokensMetaRepository } from './../repositories/06.tokensDBRepo';
import { TokensQueryMetaRepository } from './../repositories/06.tokensQRepo';
import { UsersRequestRepository } from '../repositories/07.usersReqDBRepo';
import { PasswordRecoveryRepository } from './../repositories/08.passwordsRecDBRepo';
import { AuthService } from './../domains/01.authService';
import { BlogsService } from '../domains/02.blogsService';
import { CommentsService } from '../domains/03.commentsService';
import { PostsService } from './../domains/04.postsService';
import { UsersService } from '../domains/05.usersService';
import { SecurityDevicesService } from '../domains/06.securityDevicesService';
import { TestController } from './../controllers/00.testController';
import { AuthController } from '../controllers/01.authController';
import { BlogsController } from './../controllers/02.blogsController';
import { CommentsController } from './../controllers/03.commentsController';
import { PostsController } from './../controllers/04.postController';
import { UsersController } from './../controllers/05.usersController';
import { SecurityDevicesController } from './../controllers/06.securityDevicesController';

const blogsRepository = new BlogsRepository();
const blogsQueryRepository = new BlogsQueryRepository();

const commentsRepository = new CommentsRepository();
const commentsQueryRepository = new CommentsQueryRepository();

const postsRepository = new PostsRepository();
const postsQueryRepository = new PostsQueryRepository();

const usersRepository = new UsersRepository();
const usersQueryRepository = new UsersQueryRepository();

const tokensMetaRepository = new TokensMetaRepository();
const tokensQueryMetaRepository = new TokensQueryMetaRepository();

const usersRequestRepository = new UsersRequestRepository();

const passwordRecoveryRepository = new PasswordRecoveryRepository();

const authService = new AuthService(
  usersRepository,
  usersQueryRepository,
  tokensMetaRepository,
  tokensQueryMetaRepository,
  passwordRecoveryRepository
);

const blogsService = new BlogsService(
  blogsRepository,
  postsRepository,
  postsQueryRepository,
  blogsQueryRepository
);

const commentsService = new CommentsService(
  commentsRepository,
  commentsQueryRepository,
  postsQueryRepository
);

const postsService = new PostsService(
  commentsQueryRepository,
  blogsQueryRepository,
  postsQueryRepository,
  postsRepository
);

const usersService = new UsersService(usersRepository, usersQueryRepository);

const securityDevicesService = new SecurityDevicesService(
  tokensMetaRepository,
  tokensQueryMetaRepository,
);

export const authController = new AuthController(authService);

export const blogsController = new BlogsController(blogsService, postsService);

export const commentsController = new CommentsController(commentsService);

export const postsController = new PostsController(
  postsService,
  commentsService
);

export const usersController = new UsersController(usersService);

export const securityDevicesController =
  new SecurityDevicesController(securityDevicesService);

export const testController = new TestController(
  tokensMetaRepository,
  usersRequestRepository,
  passwordRecoveryRepository,
  blogsRepository,
  postsRepository,
  commentsRepository,
  usersRepository,
);