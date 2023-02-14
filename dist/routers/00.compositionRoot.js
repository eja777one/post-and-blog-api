"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = void 0;
require("reflect-metadata");
const blogsDBRepo_1 = require("../features/blogs/infrastructure/blogsDBRepo");
const blogsQRepo_1 = require("../features/blogs/infrastructure/blogsQRepo");
const commentsDBRepo_1 = require("../features/comments/infrastructure/commentsDBRepo");
const commentsQRepo_1 = require("../features/comments/infrastructure/commentsQRepo");
const postsDBRepo_1 = require("../features/posts/infrastructure/postsDBRepo");
const postsQRepo_1 = require("../features/posts/infrastructure/postsQRepo");
const usersDBRepo_1 = require("../features/users/infrastructure/usersDBRepo");
const usersQRepo_1 = require("../features/users/infrastructure/usersQRepo");
const tokensDBRepo_1 = require("../features/devices/infrastructure/tokensDBRepo");
const tokensQRepo_1 = require("../features/devices/infrastructure/tokensQRepo");
const usersReqDBRepo_1 = require("../features/users/infrastructure/usersReqDBRepo");
const passwordsRecDBRepo_1 = require("../features/users/infrastructure/passwordsRecDBRepo");
const authService_1 = require("../features/users/application/authService");
const blogsService_1 = require("../features/blogs/application/blogsService");
const commentsService_1 = require("../features/comments/application/commentsService");
const postsService_1 = require("../features/posts/application/postsService");
const usersService_1 = require("../features/users/application/usersService");
const securityDevicesService_1 = require("../features/devices/application/securityDevicesService");
const testController_1 = require("../features/test/testController");
const authController_1 = require("../features/users/api/authController");
const blogsController_1 = require("../features/blogs/api/blogsController");
const commentsController_1 = require("../features/comments/api/commentsController");
const postController_1 = require("../features/posts/api/postController");
const usersController_1 = require("../features/users/api/usersController");
const securityDevicesController_1 = require("../features/devices/api/securityDevicesController");
const inversify_1 = require("inversify");
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
exports.container = new inversify_1.Container();
exports.container.bind(blogsDBRepo_1.BlogsRepository).to(blogsDBRepo_1.BlogsRepository);
exports.container.bind(blogsQRepo_1.BlogsQueryRepository).to(blogsQRepo_1.BlogsQueryRepository);
exports.container.bind(commentsDBRepo_1.CommentsRepository).to(commentsDBRepo_1.CommentsRepository);
exports.container.bind(commentsQRepo_1.CommentsQueryRepository).to(commentsQRepo_1.CommentsQueryRepository);
exports.container.bind(postsDBRepo_1.PostsRepository).to(postsDBRepo_1.PostsRepository);
exports.container.bind(postsQRepo_1.PostsQueryRepository).to(postsQRepo_1.PostsQueryRepository);
exports.container.bind(usersDBRepo_1.UsersRepository).to(usersDBRepo_1.UsersRepository);
exports.container.bind(usersQRepo_1.UsersQueryRepository).to(usersQRepo_1.UsersQueryRepository);
exports.container.bind(tokensDBRepo_1.TokensMetaRepository).to(tokensDBRepo_1.TokensMetaRepository);
exports.container.bind(tokensQRepo_1.TokensQueryMetaRepository).to(tokensQRepo_1.TokensQueryMetaRepository);
exports.container.bind(usersReqDBRepo_1.UsersRequestRepository).to(usersReqDBRepo_1.UsersRequestRepository);
exports.container.bind(passwordsRecDBRepo_1.PasswordRecoveryRepository).to(passwordsRecDBRepo_1.PasswordRecoveryRepository);
exports.container.bind(authService_1.AuthService).to(authService_1.AuthService);
exports.container.bind(blogsService_1.BlogsService).to(blogsService_1.BlogsService);
exports.container.bind(commentsService_1.CommentsService).to(commentsService_1.CommentsService);
exports.container.bind(postsService_1.PostsService).to(postsService_1.PostsService);
exports.container.bind(usersService_1.UsersService).to(usersService_1.UsersService);
exports.container.bind(securityDevicesService_1.SecurityDevicesService).to(securityDevicesService_1.SecurityDevicesService);
exports.container.bind(authController_1.AuthController).to(authController_1.AuthController);
exports.container.bind(blogsController_1.BlogsController).to(blogsController_1.BlogsController);
exports.container.bind(commentsController_1.CommentsController).to(commentsController_1.CommentsController);
exports.container.bind(postController_1.PostsController).to(postController_1.PostsController);
exports.container.bind(usersController_1.UsersController).to(usersController_1.UsersController);
exports.container.bind(securityDevicesController_1.SecurityDevicesController).to(securityDevicesController_1.SecurityDevicesController);
exports.container.bind(testController_1.TestController).to(testController_1.TestController);
