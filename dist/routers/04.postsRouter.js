"use strict";
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
exports.postsRouter = void 0;
const express_1 = require("express");
const _04_postsService_1 = require("../domains/04.postsService");
const _03_commentsService_1 = require("../domains/03.commentsService");
const authMware_1 = require("../middlewares/authMware");
const checkParamMware_1 = require("../middlewares/checkParamMware");
const checkAuthMware_1 = require("../middlewares/checkAuthMware");
const prepareQuery_1 = require("../application/prepareQuery");
const checkReqBodyMware_1 = require("../middlewares/checkReqBodyMware");
const models_1 = require("../models");
exports.postsRouter = (0, express_1.Router)({});
class PostsController {
    constructor() {
        this.postsService = new _04_postsService_1.PostsService();
        this.commentsService = new _03_commentsService_1.CommentsService();
    }
    getPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield this.postsService.getPost(req.params.id);
            if (!post)
                return res.sendStatus(models_1.HTTP.NOT_FOUND_404);
            res.status(models_1.HTTP.OK_200).json(post); // TEST #3.6, #3.11
        });
    }
    getPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = (0, prepareQuery_1.prepareQueries)(req.query);
            const posts = yield this.postsService.getPosts(query);
            return res.status(200).json(posts); // TEST #3.1, #3.24
        });
    }
    getPostsComments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = (0, prepareQuery_1.prepareQueries)(req.query);
            const postsComments = yield this.postsService
                .getPostsComments(query, req.params.postId);
            if (!postsComments)
                return res.sendStatus(models_1.HTTP.NOT_FOUND_404); // TEST #3.12
            res.status(models_1.HTTP.OK_200).json(postsComments); // TEST #3.13, #3.20
        });
    }
    createPostsComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.user)
                return res.sendStatus(models_1.HTTP.UNAUTHORIZED_401); // TEST #3.17
            const comment = yield this.commentsService
                .addComment(req.user, req.params.postId, req.body);
            if (!comment)
                return res.sendStatus(models_1.HTTP.NOT_FOUND_404);
            res.status(models_1.HTTP.CREATED_201).json(comment); // TEST #3.19
        });
    }
    createPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield this.postsService.createPost(req.body);
            if (!post)
                return res.sendStatus(models_1.HTTP.NOT_FOUND_404);
            res.status(models_1.HTTP.CREATED_201).json(post); // TEST #2.4, #3.4
        });
    }
    updatePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const modified = yield this.postsService.updatePost(req.params.id, req.body);
            if (!modified)
                return res.sendStatus(models_1.HTTP.NOT_FOUND_404);
            res.sendStatus(models_1.HTTP.NO_CONTENT_204); // TEST #3.10
        });
    }
    deletePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleted = yield this.postsService.deletePost(req.params.id);
            if (!deleted)
                return res.sendStatus(models_1.HTTP.NOT_FOUND_404);
            res.sendStatus(models_1.HTTP.NO_CONTENT_204); // TEST #3.23
        });
    }
}
;
const postsController = new PostsController();
exports.postsRouter.get('/', postsController.getPosts.bind(postsController));
exports.postsRouter.get('/:postId/comments', checkParamMware_1.checkIsObjectId, postsController.getPostsComments.bind(postsController));
exports.postsRouter.post('/:postId/comments', authMware_1.authMware, checkParamMware_1.checkIsObjectId, checkReqBodyMware_1.testCommentBody, checkReqBodyMware_1.checkReqBodyMware, postsController.createPostsComment.bind(postsController));
exports.postsRouter.post('/', checkAuthMware_1.checkAuthMware, checkReqBodyMware_1.testPostsReqBody, checkReqBodyMware_1.checkReqBodyMware, postsController.createPost.bind(postsController));
exports.postsRouter.get('/:id', checkParamMware_1.checkIsObjectId, postsController.getPost.bind(postsController));
exports.postsRouter.put('/:id', checkAuthMware_1.checkAuthMware, checkParamMware_1.checkIsObjectId, checkReqBodyMware_1.testPostsReqBody, checkReqBodyMware_1.checkReqBodyMware, postsController.updatePost.bind(postsController));
exports.postsRouter.delete('/:id', checkAuthMware_1.checkAuthMware, checkParamMware_1.checkIsObjectId, postsController.deletePost.bind(postsController));
