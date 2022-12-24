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
const checkReqBodyMware_1 = require("../middlewares/checkReqBodyMware");
const checkParamMware_1 = require("../middlewares/checkParamMware");
const checkAuthMware_1 = require("../middlewares/checkAuthMware");
const blogs_services_1 = require("../domains/blogs-services");
const models_1 = require("../models");
const mappers_1 = require("./mappers");
exports.blogsRouter = (0, express_1.Router)({});
exports.blogsRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = (0, mappers_1.prepareQueries)(req.query);
    const blogs = yield blogs_services_1.blogServices.getBlogsByQuery(query);
    const formatBlogs = (0, mappers_1.prepareBlogs)(blogs);
    res.status(models_1.HTTP.OK_200).json(formatBlogs); // TEST #2.1, #2.15
}));
exports.blogsRouter.post('/', checkAuthMware_1.testBaseAuth, checkAuthMware_1.checkAuthMware, checkReqBodyMware_1.testBlogsReqBody, checkReqBodyMware_1.checkReqBodyMware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield blogs_services_1.blogServices.createBlog(req.body);
    if (blog) {
        const formatBlog = (0, mappers_1.prepareBlog)(blog);
        res.status(models_1.HTTP.CREATED_201).json(formatBlog); // TEST #2.4
    }
    ;
}));
exports.blogsRouter.get('/:id', checkParamMware_1.testBlogsParamId, checkParamMware_1.checkParamMware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield blogs_services_1.blogServices.getBlogById(req.params.id);
    if (blog) {
        const formatBlog = (0, mappers_1.prepareBlog)(blog);
        res.status(models_1.HTTP.OK_200).json(formatBlog); // TEST #2.6, #2.11
    }
    ;
}));
exports.blogsRouter.put('/:id', checkAuthMware_1.testBaseAuth, checkAuthMware_1.checkAuthMware, checkParamMware_1.testBlogsParamId, checkParamMware_1.checkParamMware, checkReqBodyMware_1.testBlogsReqBody, checkReqBodyMware_1.checkReqBodyMware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield blogs_services_1.blogServices.updateBlog(req.params.id, req.body);
    res.sendStatus(models_1.HTTP.NO_CONTENT_204); // TEST #2.10
}));
exports.blogsRouter.delete('/:id', checkAuthMware_1.testBaseAuth, checkAuthMware_1.checkAuthMware, checkParamMware_1.testBlogsParamId, checkParamMware_1.checkParamMware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield blogs_services_1.blogServices.deleteBlogById(req.params.id);
    res.sendStatus(models_1.HTTP.NO_CONTENT_204); // TEST #2.14
}));
exports.blogsRouter.get('/:blogId/posts', checkParamMware_1.testBlogsParamBlogID, checkParamMware_1.checkParamMware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = (0, mappers_1.prepareQueries)(req.query);
    const posts = yield blogs_services_1.blogServices.getPostsByBlogId(req.params.blogId, query);
    const formatPosts = (0, mappers_1.preparePosts)(posts);
    return res.status(models_1.HTTP.OK_200).json(formatPosts); // TEST #2.92, #2.97
}));
exports.blogsRouter.post('/:blogId/posts', checkAuthMware_1.testBaseAuth, checkAuthMware_1.checkAuthMware, checkParamMware_1.testBlogsParamBlogID, checkParamMware_1.checkParamMware, checkReqBodyMware_1.testPostsReqBodyNoBlogId, checkReqBodyMware_1.checkReqBodyMware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield blogs_services_1.blogServices.createPostsByBlogId(req.params.blogId, req.body);
    if (post) {
        const formatPost = (0, mappers_1.preparePost)(post);
        return res.status(models_1.HTTP.CREATED_201).json(formatPost); // TEST #2.96
    }
    ;
}));
