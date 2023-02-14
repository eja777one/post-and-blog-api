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
exports.BlogsService = void 0;
const db_1 = require("./../../../db");
const inversify_1 = require("inversify");
const blogsQRepo_1 = require("../infrastructure/blogsQRepo");
const blogsDBRepo_1 = require("../infrastructure/blogsDBRepo");
const postsDBRepo_1 = require("../../posts/infrastructure/postsDBRepo");
const postsQRepo_1 = require("../../posts/infrastructure/postsQRepo");
const models_1 = require("../../../models");
let BlogsService = class BlogsService {
    constructor(blogsRepository, postsRepository, postsQueryRepository, blogsQueryRepository) {
        this.blogsRepository = blogsRepository;
        this.postsRepository = postsRepository;
        this.postsQueryRepository = postsQueryRepository;
        this.blogsQueryRepository = blogsQueryRepository;
    }
    ;
    getBlog(blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield this.blogsQueryRepository.getBlog(blogId);
            if (blog)
                return new models_1.BLLResponse(200, blog);
            else
                return new models_1.BLLResponse(404);
        });
    }
    ;
    getBlogs(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const blogs = yield this.blogsQueryRepository.getBlogs(query);
            return new models_1.BLLResponse(200, blogs);
        });
    }
    ;
    createBlog(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, description, websiteUrl } = body;
            const newBlog = db_1.BlogModel.makeBlog(name, description, websiteUrl);
            const blogId = yield this.blogsRepository.save(newBlog);
            const blog = yield this.blogsQueryRepository.getBlog(blogId);
            if (blog)
                return new models_1.BLLResponse(201, blog);
            else
                return new models_1.BLLResponse(404);
        });
    }
    updateBlog(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield this.blogsQueryRepository.getSmartBlog(id);
            if (!blog)
                return new models_1.BLLResponse(404);
            blog.updateBlog(body.name, body.description, body.websiteUrl);
            yield this.blogsRepository.save(blog);
            if (blog.name === body.name)
                return new models_1.BLLResponse(204);
            // you need to refactor moment downstairs
            const posts = yield this.postsQueryRepository.getAllPostsByBlogId(id);
            for (let post of posts) {
                yield this.postsRepository
                    .updatePostsBlogName(post._id.toString(), body.name);
            }
            ;
            return new models_1.BLLResponse(204);
        });
    }
    deleteBlog(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleted = yield this.blogsRepository.deleteBlog(id);
            if (!deleted)
                return new models_1.BLLResponse(404);
            const posts = yield this.postsQueryRepository.getAllPostsByBlogId(id);
            if (posts.length === 0)
                return new models_1.BLLResponse(204);
            for (let post of posts) {
                yield this.postsRepository.deletePost(post._id.toString());
            }
            ;
            return new models_1.BLLResponse(204);
        });
    }
    deleteAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.blogsRepository.deleteAll();
            return result;
        });
    }
};
BlogsService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(blogsDBRepo_1.BlogsRepository)),
    __param(1, (0, inversify_1.inject)(postsDBRepo_1.PostsRepository)),
    __param(2, (0, inversify_1.inject)(postsQRepo_1.PostsQueryRepository)),
    __param(3, (0, inversify_1.inject)(blogsQRepo_1.BlogsQueryRepository)),
    __metadata("design:paramtypes", [blogsDBRepo_1.BlogsRepository,
        postsDBRepo_1.PostsRepository,
        postsQRepo_1.PostsQueryRepository,
        blogsQRepo_1.BlogsQueryRepository])
], BlogsService);
exports.BlogsService = BlogsService;
;
