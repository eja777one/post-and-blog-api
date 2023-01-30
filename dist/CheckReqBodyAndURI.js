"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postExistInDB = exports.blogExistInDB = exports.checkReqBodyForPost = exports.checkReqBodyForBlog = void 0;
const blogs_repository_1 = require("./repositories/blogs-repository");
const checkReqBodyForBlog = (body) => {
    const errors = [];
    const { name, description, websiteUrl } = body;
    if (!name || name.length >= 15) {
        errors.push({ message: 'incorrect name', field: 'name' });
    }
    ;
    if (!description || description.length >= 500) {
        errors.push({ message: 'incorrect description', field: 'description' });
    }
    ;
    const htmlTemplate = new RegExp('^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$');
    if (!websiteUrl || websiteUrl.length >= 100 || !htmlTemplate.test(websiteUrl)) {
        errors.push({ message: 'incorrect websiteUrl', field: 'websiteUrl' });
    }
    ;
    if (errors.length > 0) {
        return { errorsMessages: errors };
    }
    else
        return false;
};
exports.checkReqBodyForBlog = checkReqBodyForBlog;
const checkReqBodyForPost = (body) => {
    const errors = [];
    const { title, shortDescription, content, blogId } = body;
    if (!title || title.length >= 30) {
        errors.push({ message: 'incorrect title', field: 'title' });
    }
    ;
    if (!shortDescription || shortDescription.length >= 100) {
        errors.push({ message: 'incorrect shortDescription', field: 'shortDescription' });
    }
    ;
    if (!content || content.length >= 1000) {
        errors.push({ message: 'incorrect content', field: 'content' });
    }
    ;
    if (!blogId || !blogs_repository_1.blogRepository.getBlogById(blogId)) {
        errors.push({ message: 'incorrect blogId', field: 'blogId' });
    }
    ;
    if (errors.length > 0) {
        return { errorsMessages: errors };
    }
    else
        return false;
};
exports.checkReqBodyForPost = checkReqBodyForPost;
const blogExistInDB = (db, id) => {
    const item = db.filter((el) => el.id === id)[0];
    return item ? item : false;
};
exports.blogExistInDB = blogExistInDB;
const postExistInDB = (db, id) => {
    const item = db.filter((el) => el.id === id)[0];
    return item ? item : false;
};
exports.postExistInDB = postExistInDB;
