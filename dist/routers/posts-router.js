"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRouter = void 0;
const express_1 = require("express");
const checkReqBodyMware_1 = require("../middlewares/checkReqBodyMware");
const checkParamMware_1 = require("../middlewares/checkParamMware");
const checkAuthMware_1 = require("../middlewares/checkAuthMware");
const posts_repository_1 = require("../repositories/posts-repository");
const HTTPStatusCodes_1 = require("../HTTPStatusCodes");
exports.postsRouter = (0, express_1.Router)({});
exports.postsRouter.get('/', (req, res) => {
    const posts = posts_repository_1.postsRepository.getPosts();
    res.status(200).json(posts); // TEST #3.1, #3.15
});
exports.postsRouter.post('/', checkAuthMware_1.testBaseAuth, checkAuthMware_1.checkAuthMware, checkReqBodyMware_1.testPostsReqBody, checkReqBodyMware_1.checkReqBodyMware, (req, res) => {
    const post = posts_repository_1.postsRepository.createPost(req.body);
    res.status(HTTPStatusCodes_1.HTTP.CREATED_201).json(post); // TEST #3.4
});
exports.postsRouter.get('/:id', checkParamMware_1.testPostsParam, checkParamMware_1.checkParamMware, (req, res) => {
    const post = posts_repository_1.postsRepository.getPostById(req.params.id);
    res.status(HTTPStatusCodes_1.HTTP.OK_200).json(post); // TEST #3.6, #3.11
});
exports.postsRouter.put('/:id', checkAuthMware_1.testBaseAuth, checkAuthMware_1.checkAuthMware, checkParamMware_1.testPostsParam, checkParamMware_1.checkParamMware, checkReqBodyMware_1.testPostsReqBody, checkReqBodyMware_1.checkReqBodyMware, (req, res) => {
    posts_repository_1.postsRepository.updatePost(req.params.id, req.body);
    res.sendStatus(HTTPStatusCodes_1.HTTP.NO_CONTENT_204); // TEST #3.10
});
exports.postsRouter.delete('/:id', checkAuthMware_1.testBaseAuth, checkAuthMware_1.checkAuthMware, checkParamMware_1.testPostsParam, checkParamMware_1.checkParamMware, (req, res) => {
    posts_repository_1.postsRepository.deletePostById(req.params.id);
    res.sendStatus(HTTPStatusCodes_1.HTTP.NO_CONTENT_204); // TEST #3.14
});
