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
exports.BlogsController = void 0;
const inversify_1 = require("inversify");
const prepareQuery_1 = require("../../../application/prepareQuery");
const blogsService_1 = require("../application/blogsService");
const postsService_1 = require("../../posts/application/postsService");
let BlogsController = class BlogsController {
    constructor(blogService, postsService) {
        this.blogService = blogService;
        this.postsService = postsService;
    }
    getBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.blogService.getBlog(req.params.id);
            res.status(result.statusCode).json(result.data);
        });
    }
    getBlogs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = (0, prepareQuery_1.prepareQueries)(req.query);
            const result = yield this.blogService.getBlogs(query);
            res.status(result.statusCode).json(result.data);
        });
    }
    createBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.blogService.createBlog(req.body);
            res.status(result.statusCode).json(result.data);
        });
    }
    updateBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.blogService.updateBlog(req.params.id, req.body);
            res.sendStatus(result.statusCode);
        });
    }
    deleteBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.blogService.deleteBlog(req.params.id);
            res.sendStatus(result.statusCode);
        });
    }
    getBlogsPosts(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const query = (0, prepareQuery_1.prepareQueries)(req.query);
            const result = yield this.postsService
                .getBlogsPosts(query, req.params.blogId, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
            res.status(result.statusCode).json(result.data);
        });
    }
    createBlogsPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.postsService
                .createBlogsPost(req.params.blogId, req.body);
            res.status(result.statusCode).json(result.data);
        });
    }
};
BlogsController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(blogsService_1.BlogsService)),
    __param(1, (0, inversify_1.inject)(postsService_1.PostsService)),
    __metadata("design:paramtypes", [blogsService_1.BlogsService,
        postsService_1.PostsService])
], BlogsController);
exports.BlogsController = BlogsController;
;
