"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.preparePosts = exports.prepareBlogs = exports.preparePost = exports.prepareBlog = exports.prepareQueries = void 0;
const models_1 = require("./../models");
const prepareQueries = (query) => {
    const queryObj = {
        pageNumber: +query.pageNumber || 1,
        pageSize: +query.pageSize || 10,
        sortBy: query.sortBy || 'createdAt',
        sortDirection: query.sortDirection || models_1.sortDirection.desc
    };
    if (query.searchNameTerm) {
        queryObj.searchNameTerm = query.searchNameTerm;
    }
    ;
    return queryObj;
};
exports.prepareQueries = prepareQueries;
const prepareBlog = (input) => {
    console.log(input);
    const obj = {
        id: input._id.toString(),
        name: input.name,
        description: input.description,
        websiteUrl: input.websiteUrl,
        createdAt: input.createdAt,
    };
    return obj;
};
exports.prepareBlog = prepareBlog;
const preparePost = (input) => {
    const obj = {
        id: input._id.toString(),
        title: input.title,
        shortDescription: input.shortDescription,
        content: input.content,
        blogId: input.blogId,
        blogName: input.blogName,
        createdAt: input.createdAt
    };
    return obj;
};
exports.preparePost = preparePost;
const prepareBlogs = (input) => {
    const obj = {
        pagesCount: input.pagesCount,
        page: input.page,
        pageSize: input.pageSize,
        totalCount: input.totalCount,
        items: input.items.map((el) => (0, exports.prepareBlog)(el))
    };
    return obj;
};
exports.prepareBlogs = prepareBlogs;
const preparePosts = (input) => {
    const obj = {
        pagesCount: input.pagesCount,
        page: input.page,
        pageSize: input.pageSize,
        totalCount: input.totalCount,
        items: input.items.map((el) => (0, exports.preparePost)(el))
    };
    return obj;
};
exports.preparePosts = preparePosts;
