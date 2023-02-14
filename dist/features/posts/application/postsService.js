"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsService = void 0;
const inversify_1 = require("inversify");
const blogsQRepo_1 = require("../../blogs/infrastructure/blogsQRepo");
const postsDBRepo_1 = require("../infrastructure/postsDBRepo");
const postsQRepo_1 = require("../infrastructure/postsQRepo");
const commentsQRepo_1 = require("../../comments/infrastructure/commentsQRepo");
const models_1 = require("../../../models");
const db_1 = require("../../../db");
let PostsService = class PostsService {
    constructor(commentsQueryRepository, blogsQueryRepository, postsQueryRepository, postsRepository) {
        this.commentsQueryRepository = commentsQueryRepository;
        this.blogsQueryRepository = blogsQueryRepository;
        this.postsQueryRepository = postsQueryRepository;
        this.postsRepository = postsRepository;
    }
    getPost(postId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield this.postsQueryRepository.getPost(postId, userId);
            if (!post)
                return new models_1.BLLResponse(404);
            else
                return new models_1.BLLResponse(200, post);
        });
    }
    getPosts(query, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const posts = yield this.postsQueryRepository.getPosts(query, undefined, userId);
            return new models_1.BLLResponse(200, posts);
        });
    }
    getBlogsPosts(query, blogId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield this.blogsQueryRepository.getBlog(blogId);
            if (!blog)
                return new models_1.BLLResponse(404);
            const posts = yield this.postsQueryRepository.getPosts(query, blogId, userId);
            return new models_1.BLLResponse(200, posts);
        });
    }
    getPostsComments(query, postId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield this.postsQueryRepository.getPost(postId);
            if (!post)
                return new models_1.BLLResponse(404);
            const comments = yield this.commentsQueryRepository
                .getComments(query, postId, userId);
            return new models_1.BLLResponse(200, comments);
        });
    }
    createPost(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield this.blogsQueryRepository.getBlog(body.blogId);
            if (!blog)
                return new models_1.BLLResponse(404);
            // console.log(blog.name)
            const post = db_1.PostModel.makePost(body.title, body.shortDescription, body.content, body.blogId, blog.name);
            const postId = yield this.postsRepository.save(post);
            const newPost = yield this.postsQueryRepository.getPost(postId);
            if (!newPost)
                return new models_1.BLLResponse(404);
            else
                return new models_1.BLLResponse(201, newPost);
        });
    }
    createBlogsPost(blogId, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const blogName = yield this.blogsQueryRepository.getBlog(blogId)
                .then(value => value ? value.name : '');
            if (!blogName)
                return new models_1.BLLResponse(404);
            const postInput = db_1.PostModel.makePost(body.title, body.shortDescription, body.content, blogId, blogName);
            const postId = yield this.postsRepository.save(postInput);
            const post = yield this.postsQueryRepository.getPost(postId);
            if (post)
                return new models_1.BLLResponse(201, post);
            else
                return new models_1.BLLResponse(404);
        });
    }
    updatePost(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield this.blogsQueryRepository.getBlog(body.blogId);
            if (!blog)
                return new models_1.BLLResponse(404);
            const post = yield this.postsQueryRepository.getSmartPost(id);
            if (!post)
                return new models_1.BLLResponse(404);
            post.updatePost(body.title, body.shortDescription, body.content, body.blogId, blog.name);
            const result = yield this.postsRepository.save(post);
            if (!result)
                return new models_1.BLLResponse(404);
            else
                return new models_1.BLLResponse(204);
        });
    }
    deletePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deletedPost = yield this.postsRepository.deletePost(id);
            if (!deletedPost)
                return new models_1.BLLResponse(404);
            else
                return new models_1.BLLResponse(204);
        });
    }
    changeLikeStatus(postId, likeStatus, userId, userLogin) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId)
                return new models_1.BLLResponse(401);
            const post = yield this.postsQueryRepository
                .getSmartPost(postId); // like = None
            if (!post)
                return new models_1.BLLResponse(404);
            const updated = post.changeLikeStatus(likeStatus, userId, userLogin);
            // console.log(post)
            yield this.postsRepository.save(post);
            return new models_1.BLLResponse(204);
        });
    }
    deleteAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.postsRepository.deleteAll();
            return result;
        });
    }
};
PostsService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(commentsQRepo_1.CommentsQueryRepository)),
    __param(1, (0, inversify_1.inject)(blogsQRepo_1.BlogsQueryRepository)),
    __param(2, (0, inversify_1.inject)(postsQRepo_1.PostsQueryRepository)),
    __param(3, (0, inversify_1.inject)(postsDBRepo_1.PostsRepository)),
    __metadata("design:paramtypes", [commentsQRepo_1.CommentsQueryRepository,
        blogsQRepo_1.BlogsQueryRepository,
        postsQRepo_1.PostsQueryRepository,
        postsDBRepo_1.PostsRepository])
], PostsService);
exports.PostsService = PostsService;
;
