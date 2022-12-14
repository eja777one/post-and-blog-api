"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRouter = void 0;
const express_1 = require("express");
const checkReqBodyMware_1 = require("../middlewares/checkReqBodyMware");
const checkParamMware_1 = require("../middlewares/checkParamMware");
const checkAuthMware_1 = require("../middlewares/checkAuthMware");
const blogs_repository_1 = require("../repositories/blogs-repository");
const HTTPStatusCodes_1 = require("../HTTPStatusCodes");
exports.blogsRouter = (0, express_1.Router)({});
exports.blogsRouter.get('/', (req, res) => {
    const blogs = blogs_repository_1.blogRepository.getBlogs();
    res.status(HTTPStatusCodes_1.HTTP.OK_200).json(blogs); // TEST #2.1, #2.15
});
exports.blogsRouter.post('/', checkAuthMware_1.testBaseAuth, checkAuthMware_1.checkAuthMware, checkReqBodyMware_1.testBlogsReqBody, checkReqBodyMware_1.checkReqBodyMware, (req, res) => {
    const blog = blogs_repository_1.blogRepository.addBlog(req.body);
    res.status(HTTPStatusCodes_1.HTTP.CREATED_201).json(blog); // TEST #2.4
});
exports.blogsRouter.get('/:id', checkParamMware_1.testBlogsParam, checkParamMware_1.checkParamMware, (req, res) => {
    const blog = blogs_repository_1.blogRepository.getBlogById(req.params.id);
    res.status(HTTPStatusCodes_1.HTTP.OK_200).json(blog); // TEST #2.6, #2.11
});
exports.blogsRouter.put('/:id', checkAuthMware_1.testBaseAuth, checkAuthMware_1.checkAuthMware, checkParamMware_1.testBlogsParam, checkParamMware_1.checkParamMware, checkReqBodyMware_1.testBlogsReqBody, checkReqBodyMware_1.checkReqBodyMware, (req, res) => {
    blogs_repository_1.blogRepository.updateBlog(req.params.id, req.body);
    res.sendStatus(HTTPStatusCodes_1.HTTP.NO_CONTENT_204); // TEST #2.10
});
exports.blogsRouter.delete('/:id', checkAuthMware_1.testBaseAuth, checkAuthMware_1.checkAuthMware, checkParamMware_1.testBlogsParam, checkParamMware_1.checkParamMware, (req, res) => {
    blogs_repository_1.blogRepository.deleteBlogById(req.params.id);
    res.sendStatus(HTTPStatusCodes_1.HTTP.NO_CONTENT_204); // TEST #2.14
});
