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
exports.blogServices = void 0;
const blogs_db_repository_1 = require("../repositories/blogs-db-repository");
const posts_db_repository_1 = require("../repositories/posts-db-repository");
exports.blogServices = {
    getBlogsByQuery(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const blogs = yield blogs_db_repository_1.blogRepository.getBlogsByQuery(query);
            return blogs;
        });
    },
    createBlog(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdAt = new Date().toISOString();
            const blog = Object.assign({ createdAt }, body);
            return yield blogs_db_repository_1.blogRepository.createBlog(blog);
        });
    },
    getBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield blogs_db_repository_1.blogRepository.getBlogById(id);
        });
    },
    updateBlog(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield blogs_db_repository_1.blogRepository.updateBlog(id, body);
        });
    },
    deleteBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield blogs_db_repository_1.blogRepository.deleteBlogById(id);
        });
    },
    getBlogs() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield blogs_db_repository_1.blogRepository.getBlogs();
        });
    },
    getPostsByBlogId(id, query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield posts_db_repository_1.postsRepository.getPostsByBlogId(id, query);
        });
    },
    createPostsByBlogId(blogId, body) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield posts_db_repository_1.postsRepository.createPost(Object.assign(Object.assign({}, body), { blogId }));
        });
    },
    deleteAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return blogs_db_repository_1.blogRepository.deleteAll();
        });
    }
};
