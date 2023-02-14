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
const inversify_1 = require("inversify");
const models_1 = require("../models");
const _02_blogsQRepo_1 = require("../repositories/02.blogsQRepo");
const _02_blogsDBRepo_1 = require("../repositories/02.blogsDBRepo");
const _04_postsDBRepo_1 = require("../repositories/04.postsDBRepo");
const _04_postsQRepo_1 = require("../repositories/04.postsQRepo");
const models_2 = require("../models");
const mongodb_1 = require("mongodb");
const inject_1 = require("inversify/dts/annotation/inject");
let BlogsService = class BlogsService {
    constructor(blogsRepository, postsRepository, postsQueryRepository, blogsQueryRepository) {
        this.blogsRepository = blogsRepository;
        this.postsRepository = postsRepository;
        this.postsQueryRepository = postsQueryRepository;
        this.blogsQueryRepository = blogsQueryRepository;
    }
    getBlog(blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield this.blogsQueryRepository.getBlog(blogId);
            let result;
            if (blog)
                result = new models_2.BLLResponse(200, blog);
            else
                result = new models_2.BLLResponse(404);
            return result;
        });
    }
    getBlogs(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const blogs = yield this.blogsQueryRepository.getBlogs(query);
            let result = new models_2.BLLResponse(200, blogs);
            return result;
        });
    }
    createBlog(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const blogInput = new models_1.BlogDBModel(new mongodb_1.ObjectId(), body.name, body.description, body.websiteUrl, new Date().toISOString());
            const blogId = yield this.blogsRepository.createBlog(blogInput);
            const blog = yield this.blogsQueryRepository.getBlog(blogId);
            let result;
            if (blog)
                result = new models_2.BLLResponse(201, blog);
            else
                result = new models_2.BLLResponse(404);
            return result;
        });
    }
    updateBlog(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield this.blogsQueryRepository.getBlog(id);
            if (!blog)
                return new models_2.BLLResponse(404);
            const updated = yield this.blogsRepository.updateBlog(id, body);
            if (!updated)
                return new models_2.BLLResponse(404);
            const blogsNameWasChanged = blog.name === body.name;
            if (!blogsNameWasChanged)
                return new models_2.BLLResponse(204);
            const posts = yield this.postsQueryRepository.getAllPostsByBlogId(id);
            for (let post of posts) {
                yield this.postsRepository
                    .updatePostsBlogName(post._id.toString(), body.name);
            }
            ;
            return new models_2.BLLResponse(204);
        });
    }
    deleteBlog(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleted = yield this.blogsRepository.deleteBlog(id);
            if (!deleted)
                return new models_2.BLLResponse(404);
            const posts = yield this.postsQueryRepository.getAllPostsByBlogId(id);
            if (posts.length === 0)
                return new models_2.BLLResponse(204);
            for (let post of posts) {
                yield this.postsRepository.deletePost(post._id.toString());
            }
            ;
            return new models_2.BLLResponse(204);
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
    __param(0, (0, inject_1.inject)(_02_blogsDBRepo_1.BlogsRepository)),
    __param(1, (0, inject_1.inject)(_04_postsDBRepo_1.PostsRepository)),
    __param(2, (0, inject_1.inject)(_04_postsQRepo_1.PostsQueryRepository)),
    __param(3, (0, inject_1.inject)(_02_blogsQRepo_1.BlogsQueryRepository)),
    __metadata("design:paramtypes", [_02_blogsDBRepo_1.BlogsRepository,
        _04_postsDBRepo_1.PostsRepository,
        _04_postsQRepo_1.PostsQueryRepository,
        _02_blogsQRepo_1.BlogsQueryRepository])
], BlogsService);
exports.BlogsService = BlogsService;
;
