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
const checkReqBodyMware_1 = require("../middlewares/checkReqBodyMware");
const checkParamMware_1 = require("../middlewares/checkParamMware");
const checkAuthMware_1 = require("../middlewares/checkAuthMware");
const posts_services_1 = require("./../domains/posts-services");
const models_1 = require("../models");
const mappers_1 = require("./mappers");
exports.postsRouter = (0, express_1.Router)({});
exports.postsRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = (0, mappers_1.prepareQueries)(req.query);
    const posts = yield posts_services_1.postsServices.getPostsByQuery(query);
    const formatPosts = (0, mappers_1.preparePosts)(posts);
    return res.status(200).json(formatPosts); // TEST #3.1, #3.15
}));
exports.postsRouter.post('/', checkAuthMware_1.testBaseAuth, checkAuthMware_1.checkAuthMware, checkReqBodyMware_1.testPostsReqBody, checkReqBodyMware_1.checkReqBodyMware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield posts_services_1.postsServices.createPost(req.body);
    if (post) {
        const formatPost = (0, mappers_1.preparePost)(post);
        return res.status(models_1.HTTP.CREATED_201).json(formatPost); // TEST #2.4
    }
    ;
}));
exports.postsRouter.get('/:id', checkParamMware_1.testPostsParam, checkParamMware_1.checkParamMware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield posts_services_1.postsServices.getPostById(req.params.id);
    if (post) {
        const formatPost = (0, mappers_1.preparePost)(post);
        res.status(models_1.HTTP.OK_200).json(formatPost); // TEST #3.6, #3.11
    }
    ;
}));
exports.postsRouter.put('/:id', checkAuthMware_1.testBaseAuth, checkAuthMware_1.checkAuthMware, checkParamMware_1.testPostsParam, checkParamMware_1.checkParamMware, checkReqBodyMware_1.testPostsReqBody, checkReqBodyMware_1.checkReqBodyMware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield posts_services_1.postsServices.updatePost(req.params.id, req.body);
    res.sendStatus(models_1.HTTP.NO_CONTENT_204); // TEST #3.10
}));
exports.postsRouter.delete('/:id', checkAuthMware_1.testBaseAuth, checkAuthMware_1.checkAuthMware, checkParamMware_1.testPostsParam, checkParamMware_1.checkParamMware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield posts_services_1.postsServices.deletePostById(req.params.id);
    res.sendStatus(models_1.HTTP.NO_CONTENT_204); // TEST #3.14
}));
