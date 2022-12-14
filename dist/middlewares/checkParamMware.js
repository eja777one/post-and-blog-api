"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkParamMware = exports.testPostsParam = exports.testBlogsParam = void 0;
const express_validator_1 = require("express-validator");
const blogs_repository_1 = require("../repositories/blogs-repository");
const posts_repository_1 = require("../repositories/posts-repository");
exports.testBlogsParam = (0, express_validator_1.param)('id')
    .isIn(blogs_repository_1.blogRepository.getBlogs().map(blog => blog.id));
exports.testPostsParam = (0, express_validator_1.param)('id')
    .isIn(posts_repository_1.postsRepository.getPosts().map(post => post.id));
const checkParamMware = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.sendStatus(404); // TEST #2.5, #2.7, #2.12, #3.5, #3.7, #3.12
    }
    else
        next();
};
exports.checkParamMware = checkParamMware;
