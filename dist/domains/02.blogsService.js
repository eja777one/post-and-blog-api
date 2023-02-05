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
exports.BlogsService = void 0;
const models_1 = require("../models");
const mongodb_1 = require("mongodb");
class BlogsService {
    constructor(blogsRepository, postsRepository, postsQueryRepository, blogsQueryRepository) {
        this.blogsRepository = blogsRepository;
        this.postsRepository = postsRepository;
        this.postsQueryRepository = postsQueryRepository;
        this.blogsQueryRepository = blogsQueryRepository;
    }
    getBlogs(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const blogs = yield this.blogsQueryRepository.getBlogs(query);
            return blogs;
        });
    }
    getBlog(blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield this.blogsQueryRepository.getBlog(blogId);
            return blog;
        });
    }
    createBlog(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const blogInput = new models_1.BlogDBModel(new mongodb_1.ObjectId(), body.name, body.description, body.websiteUrl, new Date().toISOString());
            const blogId = yield this.blogsRepository.createBlog(blogInput);
            const blog = yield this.blogsQueryRepository.getBlog(blogId);
            return blog;
        });
    }
    updateBlog(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield this.blogsQueryRepository.getBlog(id);
            if (!blog)
                return null;
            const updated = yield this.blogsRepository.updateBlog(id, body);
            const blogsNameWasChanged = blog.name === body.name;
            if (!blogsNameWasChanged)
                return updated;
            const posts = yield this.postsQueryRepository.getAllPostsByBlogId(id);
            for (let post of posts) {
                yield this.postsRepository
                    .updatePostsBlogName(post._id.toString(), body.name);
            }
            ;
            return updated;
        });
    }
    deleteBlog(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleted = yield this.blogsRepository.deleteBlog(id);
            const posts = yield this.postsQueryRepository.getAllPostsByBlogId(id);
            if (posts.length === 0)
                return deleted;
            for (let post of posts) {
                yield this.postsRepository.deletePost(post._id.toString());
            }
            ;
            return deleted;
        });
    }
    deleteAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.blogsRepository.deleteAll();
            return result;
        });
    }
}
exports.BlogsService = BlogsService;
;
