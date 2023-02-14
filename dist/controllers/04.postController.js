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
exports.PostsController = void 0;
const inversify_1 = require("inversify");
const prepareQuery_1 = require("./../application/prepareQuery");
const _03_commentsService_1 = require("./../domains/03.commentsService");
const _04_postsService_1 = require("./../domains/04.postsService");
let PostsController = class PostsController {
    constructor(postsService, commentsService) {
        this.postsService = postsService;
        this.commentsService = commentsService;
    }
    getPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.postsService.getPost(req.params.id);
            res.status(result.statusCode).json(result.data);
        });
    }
    getPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = (0, prepareQuery_1.prepareQueries)(req.query);
            const result = yield this.postsService.getPosts(query);
            res.status(result.statusCode).json(result.data);
        });
    }
    getPostsComments(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const query = (0, prepareQuery_1.prepareQueries)(req.query);
            const result = yield this.postsService
                .getPostsComments(query, req.params.postId, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
            res.status(result.statusCode).json(result.data);
        });
    }
    createPostsComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.commentsService
                .addComment(req.user, req.params.postId, req.body);
            res.status(result.statusCode).json(result.data);
        });
    }
    createPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.postsService.createPost(req.body);
            res.status(result.statusCode).json(result.data);
        });
    }
    updatePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.postsService.updatePost(req.params.id, req.body);
            res.status(result.statusCode).json(result.data);
        });
    }
    deletePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.postsService.deletePost(req.params.id);
            res.status(result.statusCode).json(result.data);
        });
    }
};
PostsController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(_04_postsService_1.PostsService)),
    __param(1, (0, inversify_1.inject)(_03_commentsService_1.CommentsService)),
    __metadata("design:paramtypes", [_04_postsService_1.PostsService,
        _03_commentsService_1.CommentsService])
], PostsController);
exports.PostsController = PostsController;
;
