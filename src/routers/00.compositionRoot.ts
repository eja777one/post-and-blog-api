import "reflect-metadata";
import { BlogsRepository } from '../features/blogs/infrastructure/blogsDBRepo';
import { BlogsQueryRepository } from '../features/blogs/infrastructure/blogsQRepo';
import { CommentsRepository } from '../features/comments/infrastructure/commentsDBRepo';
import { CommentsQueryRepository } from '../features/comments/infrastructure/commentsQRepo';
import { PostsRepository } from '../features/posts/infrastructure/postsDBRepo';
import { PostsQueryRepository } from '../features/posts/infrastructure/postsQRepo';
import { UsersRepository } from '../features/users/infrastructure/usersDBRepo';
import { UsersQueryRepository } from '../features/users/infrastructure/usersQRepo';
import { TokensMetaRepository } from '../features/devices/infrastructure/tokensDBRepo';
import { TokensQueryMetaRepository } from '../features/devices/infrastructure/tokensQRepo';
import { UsersRequestRepository } from '../features/users/infrastructure/usersReqDBRepo';
import { PasswordRecoveryRepository } from '../features/users/infrastructure/passwordsRecDBRepo';
import { AuthService } from '../features/users/application/authService';
import { BlogsService } from '../features/blogs/application/blogsService';
import { CommentsService } from '../features/comments/application/commentsService';
import { PostsService } from '../features/posts/application/postsService';
import { UsersService } from '../features/users/application/usersService';
import { SecurityDevicesService } from '../features/devices/application/securityDevicesService';
import { TestController } from '../features/test/testController';
import { AuthController } from '../features/users/api/authController';
import { BlogsController } from '../features/blogs/api/blogsController';
import { CommentsController } from '../features/comments/api/commentsController';
import { PostsController } from '../features/posts/api/postController';
import { UsersController } from '../features/users/api/usersController';
import { SecurityDevicesController } from '../features/devices/api/securityDevicesController';
import { Container } from "inversify";

// const blogsRepository = new BlogsRepository();
// const blogsQueryRepository = new BlogsQueryRepository();

// const commentsRepository = new CommentsRepository();
// const commentsQueryRepository = new CommentsQueryRepository();

// const postsRepository = new PostsRepository();
// const postsQueryRepository = new PostsQueryRepository();

// const usersRepository = new UsersRepository();
// const usersQueryRepository = new UsersQueryRepository();

// const tokensMetaRepository = new TokensMetaRepository();
// const tokensQueryMetaRepository = new TokensQueryMetaRepository();

// const usersRequestRepository = new UsersRequestRepository();

// const passwordRecoveryRepository = new PasswordRecoveryRepository();

// const authService = new AuthService(
//   usersRepository,
//   usersQueryRepository,
//   tokensMetaRepository,
//   tokensQueryMetaRepository,
//   passwordRecoveryRepository
// );

// const blogsService = new BlogsService(
//   blogsRepository,
//   postsRepository,
//   postsQueryRepository,
//   blogsQueryRepository
// );

// const commentsService = new CommentsService(
//   commentsRepository,
//   commentsQueryRepository,
//   postsQueryRepository
// );

// const postsService = new PostsService(
//   commentsQueryRepository,
//   blogsQueryRepository,
//   postsQueryRepository,
//   postsRepository
// );

// const usersService = new UsersService(usersRepository, usersQueryRepository);

// const securityDevicesService = new SecurityDevicesService(
//   tokensMetaRepository,
//   tokensQueryMetaRepository,
// );

// export const authController = new AuthController(authService);

// export const blogsController = new BlogsController(blogsService, postsService);

// export const commentsController = new CommentsController(commentsService);

// export const postsController = new PostsController(
//   postsService,
//   commentsService
// );

// export const usersController = new UsersController(usersService);

// export const securityDevicesController =
//   new SecurityDevicesController(securityDevicesService);

// export const testController = new TestController(
//   tokensMetaRepository,
//   usersRequestRepository,
//   passwordRecoveryRepository,
//   blogsRepository,
//   postsRepository,
//   commentsRepository,
//   usersRepository,
// );

export const container = new Container();

container.bind(BlogsRepository).to(BlogsRepository);
container.bind(BlogsQueryRepository).to(BlogsQueryRepository);
container.bind(CommentsRepository).to(CommentsRepository);
container.bind(CommentsQueryRepository).to(CommentsQueryRepository);
container.bind(PostsRepository).to(PostsRepository);
container.bind(PostsQueryRepository).to(PostsQueryRepository);
container.bind(UsersRepository).to(UsersRepository);
container.bind(UsersQueryRepository).to(UsersQueryRepository);
container.bind(TokensMetaRepository).to(TokensMetaRepository);
container.bind(TokensQueryMetaRepository).to(TokensQueryMetaRepository);
container.bind(UsersRequestRepository).to(UsersRequestRepository);
container.bind(PasswordRecoveryRepository).to(PasswordRecoveryRepository);

container.bind(AuthService).to(AuthService);
container.bind(BlogsService).to(BlogsService);
container.bind(CommentsService).to(CommentsService);
container.bind(PostsService).to(PostsService);
container.bind(UsersService).to(UsersService);
container.bind(SecurityDevicesService).to(SecurityDevicesService);

container.bind(AuthController).to(AuthController);
container.bind(BlogsController).to(BlogsController);
container.bind(CommentsController).to(CommentsController);
container.bind(PostsController).to(PostsController);
container.bind(UsersController).to(UsersController);
container.bind(SecurityDevicesController).to(SecurityDevicesController);
container.bind(TestController).to(TestController);
