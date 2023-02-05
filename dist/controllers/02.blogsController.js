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
exports.BlogsController = void 0;
const prepareQuery_1 = require("../application/prepareQuery");
const models_1 = require("../models");
class BlogsController {
    constructor(blogService, postsService) {
        this.blogService = blogService;
        this.postsService = postsService;
    }
    getBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield this.blogService.getBlog(req.params.id);
            if (!blog)
                return res.sendStatus(models_1.HTTP.NOT_FOUND_404);
            res.status(models_1.HTTP.OK_200).json(blog); // TEST #2.6, #2.11
        });
    }
    getBlogs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = (0, prepareQuery_1.prepareQueries)(req.query);
            const blogs = yield this.blogService.getBlogs(query);
            res.status(models_1.HTTP.OK_200).json(blogs); // TEST #2.1, #2.22
        });
    }
    createBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield this.blogService.createBlog(req.body);
            if (!blog)
                return res.sendStatus(models_1.HTTP.NOT_FOUND_404);
            res.status(models_1.HTTP.CREATED_201).json(blog); // TEST #2.4
        });
    }
    updateBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield this.blogService.updateBlog(req.params.id, req.body);
            if (!updated)
                return res.sendStatus(models_1.HTTP.NOT_FOUND_404);
            res.sendStatus(models_1.HTTP.NO_CONTENT_204); // TEST #2.10
        });
    }
    deleteBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleted = yield this.blogService.deleteBlog(req.params.id);
            if (!deleted)
                return res.sendStatus(models_1.HTTP.NOT_FOUND_404);
            res.sendStatus(models_1.HTTP.NO_CONTENT_204); // TEST #2.21
        });
    }
    getBlogsPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = (0, prepareQuery_1.prepareQueries)(req.query);
            const posts = yield this.postsService
                .getBlogsPosts(query, req.params.blogId);
            if (!posts)
                return res.sendStatus(models_1.HTTP.NOT_FOUND_404);
            res.status(models_1.HTTP.OK_200).json(posts); // TEST #2.13, #2.18
        });
    }
    createBlogsPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield this.postsService
                .createBlogsPost(req.params.blogId, req.body);
            if (!post)
                return res.sendStatus(models_1.HTTP.NOT_FOUND_404);
            res.status(models_1.HTTP.CREATED_201).json(post); // TEST #2.17
        });
    }
}
exports.BlogsController = BlogsController;
;
