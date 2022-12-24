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
exports.checkParamMware = exports.testPostsParam = exports.testBlogsParamBlogID = exports.testBlogsParamId = void 0;
const express_validator_1 = require("express-validator");
const blogs_db_repository_1 = require("../repositories/blogs-db-repository");
const posts_db_repository_1 = require("../repositories/posts-db-repository");
exports.testBlogsParamId = (0, express_validator_1.param)('id')
    .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
    const blogsIds = yield blogs_db_repository_1.blogRepository.getBlogs().
        then(value => value.map(el => el._id.toString()));
    console.log(blogsIds);
    console.log(value);
    if (blogsIds.indexOf(value) === -1)
        throw new Error("id is unexist");
    else
        return true;
}));
exports.testBlogsParamBlogID = (0, express_validator_1.param)('blogId')
    .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
    const blogsIds = yield blogs_db_repository_1.blogRepository.getBlogs()
        .then(value => value.map(el => el._id.toString()));
    console.log(blogsIds);
    console.log(value);
    if (blogsIds.indexOf(value) === -1)
        throw new Error("blogId is unexist");
    else
        return true;
}));
exports.testPostsParam = (0, express_validator_1.param)('id')
    .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
    // const postsIds = postsRepository.getPosts().map(post => post.id);
    const postsIds = yield posts_db_repository_1.postsRepository.getPosts()
        .then(value => value.map(el => el._id.toString()));
    // console.log(postsIds)
    // console.log(value)
    if (postsIds.indexOf(value) === -1)
        throw new Error("id is unexist");
    else
        return true;
}));
const checkParamMware = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    // console.log(errors);
    if (!errors.isEmpty()) {
        console.log(errors);
        return res.sendStatus(404); // TEST #2.5, #2.7, #2.12, #3.5, #3.7, #3.12
    }
    else
        next();
};
exports.checkParamMware = checkParamMware;
