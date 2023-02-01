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
const _02_blogsService_1 = require("../domains/02.blogsService");
const prepareQuery_1 = require("../application/prepareQuery");
const checkParamMware_1 = require("../middlewares/checkParamMware");
const checkAuthMware_1 = require("../middlewares/checkAuthMware");
const _04_postsQRepo_1 = require("../repositories/04.postsQRepo");
const _02_blogsQRepo_1 = require("../repositories/02.blogsQRepo");
const checkReqBodyMware_1 = require("../middlewares/checkReqBodyMware");
const models_1 = require("../models");
exports.blogsRouter = (0, express_1.Router)({});
class BlogsController {
    getBlogs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = (0, prepareQuery_1.prepareQueries)(req.query);
            const blogs = yield _02_blogsQRepo_1.blogsQueryRepository.getBlogs(query);
            res.status(models_1.HTTP.OK_200).json(blogs); // TEST #2.1, #2.22
        });
    }
    createBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const blogId = yield _02_blogsService_1.blogService.createBlog(req.body);
            const blog = yield _02_blogsQRepo_1.blogsQueryRepository.getBlog(blogId);
            if (!blog)
                return res.sendStatus(models_1.HTTP.NOT_FOUND_404);
            res.status(models_1.HTTP.CREATED_201).json(blog); // TEST #2.4
        });
    }
    getBlogById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield _02_blogsQRepo_1.blogsQueryRepository.getBlog(req.params.id);
            if (!blog)
                return res.sendStatus(models_1.HTTP.NOT_FOUND_404);
            res.status(models_1.HTTP.OK_200).json(blog); // TEST #2.6, #2.11
        });
    }
    updateBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield _02_blogsService_1.blogService.updateBlog(req.params.id, req.body);
            if (!updated)
                return res.sendStatus(models_1.HTTP.NOT_FOUND_404);
            res.sendStatus(models_1.HTTP.NO_CONTENT_204); // TEST #2.10
        });
    }
    deleteBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleted = yield _02_blogsService_1.blogService.deleteBlog(req.params.id);
            if (!deleted)
                return res.sendStatus(models_1.HTTP.NOT_FOUND_404);
            res.sendStatus(models_1.HTTP.NO_CONTENT_204); // TEST #2.21
        });
    }
    getBlogsPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield _02_blogsQRepo_1.blogsQueryRepository.getBlog(req.params.blogId);
            if (!blog)
                return res.sendStatus(models_1.HTTP.NOT_FOUND_404);
            const query = (0, prepareQuery_1.prepareQueries)(req.query);
            const posts = yield _04_postsQRepo_1.postsQueryRepository.getPosts(query, req.params.blogId);
            res.status(models_1.HTTP.OK_200).json(posts); // TEST #2.13, #2.18
        });
    }
    createBlogsPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const postId = yield _02_blogsService_1.blogService
                .createPostsByBlogId(req.params.blogId, req.body);
            if (!postId)
                return res.sendStatus(models_1.HTTP.NOT_FOUND_404);
            const post = yield _04_postsQRepo_1.postsQueryRepository.getPost(postId);
            if (!post)
                return res.sendStatus(models_1.HTTP.NOT_FOUND_404);
            res.status(models_1.HTTP.CREATED_201).json(post); // TEST #2.17
        });
    }
}
;
const blogsController = new BlogsController();
exports.blogsRouter.get('/', blogsController.getBlogs);
exports.blogsRouter.post('/', checkAuthMware_1.checkAuthMware, checkReqBodyMware_1.testBlogsReqBody, checkReqBodyMware_1.checkReqBodyMware, blogsController.createBlog);
exports.blogsRouter.get('/:id', checkParamMware_1.checkIsObjectId, blogsController.getBlogById);
exports.blogsRouter.put('/:id', checkAuthMware_1.checkAuthMware, checkParamMware_1.checkIsObjectId, checkReqBodyMware_1.testBlogsReqBody, checkReqBodyMware_1.checkReqBodyMware, blogsController.updateBlog);
exports.blogsRouter.delete('/:id', checkAuthMware_1.checkAuthMware, checkParamMware_1.checkIsObjectId, blogsController.deleteBlog);
exports.blogsRouter.get('/:blogId/posts', checkParamMware_1.checkIsObjectId, blogsController.getBlogsPosts);
exports.blogsRouter.post('/:blogId/posts', checkAuthMware_1.checkAuthMware, checkParamMware_1.checkIsObjectId, checkReqBodyMware_1.testPostsReqBodyNoBlogId, checkReqBodyMware_1.checkReqBodyMware, blogsController.createBlogsPost);
