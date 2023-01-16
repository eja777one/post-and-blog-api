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
exports.blogsRouter = void 0;
const express_1 = require("express");
const _04_postsQueryRepository_1 = require("../repositories/04.postsQueryRepository");
const _02_blogsQueryRepository_1 = require("../repositories/02.blogsQueryRepository");
const checkReqBodyMware_1 = require("../middlewares/checkReqBodyMware");
const checkParamMware_1 = require("../middlewares/checkParamMware");
const checkAuthMware_1 = require("../middlewares/checkAuthMware");
const _02_blogsServices_1 = require("../domains/02.blogsServices");
const models_1 = require("../models");
const prepareQuery_1 = require("../application/prepareQuery");
exports.blogsRouter = (0, express_1.Router)({});
exports.blogsRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = (0, prepareQuery_1.prepareQueries)(req.query);
    const blogs = yield _02_blogsQueryRepository_1.blogsQueryRepository.getBlogsByQuery(query);
    res.status(models_1.HTTP.OK_200).json(blogs); // TEST #2.1, #2.22
}));
exports.blogsRouter.post('/', checkAuthMware_1.checkAuthMware, checkReqBodyMware_1.testBlogsReqBody, checkReqBodyMware_1.checkReqBodyMware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blogId = yield _02_blogsServices_1.blogServices.createBlog(req.body);
    const blog = yield _02_blogsQueryRepository_1.blogsQueryRepository.getBlogById(blogId);
    if (blog)
        res.status(models_1.HTTP.CREATED_201).json(blog); // TEST #2.4
}));
exports.blogsRouter.get('/:id', checkParamMware_1.checkIsObjectId, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield _02_blogsQueryRepository_1.blogsQueryRepository.getBlogById(req.params.id);
    if (blog)
        res.status(models_1.HTTP.OK_200).json(blog); // TEST #2.6, #2.11
    else
        res.sendStatus(models_1.HTTP.NOT_FOUND_404);
}));
exports.blogsRouter.put('/:id', checkAuthMware_1.checkAuthMware, checkParamMware_1.checkIsObjectId, checkReqBodyMware_1.testBlogsReqBody, checkReqBodyMware_1.checkReqBodyMware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updated = yield _02_blogsServices_1.blogServices.updateBlog(req.params.id, req.body);
    if (updated)
        res.sendStatus(models_1.HTTP.NO_CONTENT_204); // TEST #2.10
    else
        res.sendStatus(models_1.HTTP.NOT_FOUND_404);
}));
exports.blogsRouter.delete('/:id', checkAuthMware_1.checkAuthMware, checkParamMware_1.checkIsObjectId, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deleted = yield _02_blogsServices_1.blogServices.deleteBlogById(req.params.id);
    if (deleted)
        res.sendStatus(models_1.HTTP.NO_CONTENT_204); // TEST #2.21
    else
        res.sendStatus(models_1.HTTP.NOT_FOUND_404);
}));
exports.blogsRouter.get('/:blogId/posts', checkParamMware_1.checkIsObjectId, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield _02_blogsQueryRepository_1.blogsQueryRepository.getBlogById(req.params.blogId);
    if (!blog)
        res.sendStatus(models_1.HTTP.NOT_FOUND_404);
    else {
        const query = (0, prepareQuery_1.prepareQueries)(req.query);
        const posts = yield _04_postsQueryRepository_1.postsQueryRepository
            .getPostsByBlogId(req.params.blogId, query);
        return res.status(models_1.HTTP.OK_200).json(posts); // TEST #2.13, #2.18
    }
    ;
}));
exports.blogsRouter.post('/:blogId/posts', checkAuthMware_1.checkAuthMware, checkParamMware_1.checkIsObjectId, checkReqBodyMware_1.testPostsReqBodyNoBlogId, checkReqBodyMware_1.checkReqBodyMware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = yield _02_blogsServices_1.blogServices
        .createPostsByBlogId(req.params.blogId, req.body);
    if (!postId)
        res.sendStatus(models_1.HTTP.NOT_FOUND_404);
    else {
        const post = yield _04_postsQueryRepository_1.postsQueryRepository.getPostById(postId);
        if (post)
            res.status(models_1.HTTP.CREATED_201).json(post); // TEST #2.17
    }
    ;
}));
