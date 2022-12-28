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
const posts_query_repository_1 = require("./../repositories/posts-query-repository");
const express_1 = require("express");
const checkReqBodyMware_1 = require("../middlewares/checkReqBodyMware");
const checkParamMware_1 = require("../middlewares/checkParamMware");
const checkAuthMware_1 = require("../middlewares/checkAuthMware");
const posts_services_1 = require("./../domains/posts-services");
const models_1 = require("../models");
const mappers_1 = require("./mappers");
exports.postsRouter = (0, express_1.Router)({});
exports.postsRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = (0, mappers_1.prepareQueries)(req.query);
    const posts = yield posts_query_repository_1.postsQueryRepository.getPostsByQuery(query);
    return res.status(200).json(posts); // TEST #3.1, #3.15
}));
exports.postsRouter.post('/', checkAuthMware_1.checkAuthMware, checkReqBodyMware_1.testPostsReqBody, checkReqBodyMware_1.checkReqBodyMware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = yield posts_services_1.postsServices.createPost(req.body);
    const post = yield posts_query_repository_1.postsQueryRepository.getPostById(postId);
    if (post)
        res.status(models_1.HTTP.CREATED_201).json(post); // TEST #2.4
}));
exports.postsRouter.get('/:id', checkParamMware_1.checkIsObjectId, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield posts_query_repository_1.postsQueryRepository.getPostById(req.params.id);
    if (post)
        res.status(models_1.HTTP.OK_200).json(post); // TEST #3.6, #3.11
    else
        res.sendStatus(models_1.HTTP.NOT_FOUND_404);
}));
exports.postsRouter.put('/:id', checkAuthMware_1.checkAuthMware, checkParamMware_1.checkIsObjectId, checkReqBodyMware_1.testPostsReqBody, checkReqBodyMware_1.checkReqBodyMware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const modified = yield posts_services_1.postsServices.updatePost(req.params.id, req.body);
    if (modified)
        res.sendStatus(models_1.HTTP.NO_CONTENT_204); // TEST #3.10
    else
        res.sendStatus(models_1.HTTP.NOT_FOUND_404);
}));
exports.postsRouter.delete('/:id', checkAuthMware_1.checkAuthMware, checkParamMware_1.checkIsObjectId, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield posts_services_1.postsServices.deletePostById(req.params.id);
    if (post)
        res.sendStatus(models_1.HTTP.NO_CONTENT_204); // TEST #3.14
    else
        res.sendStatus(models_1.HTTP.NOT_FOUND_404);
}));
