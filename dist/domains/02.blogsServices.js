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
const _04_postsQueryRepository_1 = require("../repositories/04.postsQueryRepository");
const _02_blogsQueryRepository_1 = require("../repositories/02.blogsQueryRepository");
const _04_postsServices_1 = require("./04.postsServices");
const _02_blogsDbRepository_1 = require("../repositories/02.blogsDbRepository");
const _04_postsDbRepository_1 = require("../repositories/04.postsDbRepository");
exports.blogServices = {
    createBlog(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdAt = new Date().toISOString();
            const blog = Object.assign({ createdAt }, body);
            return yield _02_blogsDbRepository_1.blogRepository.createBlog(blog);
        });
    },
    updateBlog(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield _02_blogsQueryRepository_1.blogsQueryRepository.getBlogById(id);
            if (!blog)
                return null;
            const lastBlogName = blog.name;
            const updated = yield _02_blogsDbRepository_1.blogRepository.updateBlog(id, body);
            const currentBlogName = body.name;
            if (lastBlogName !== currentBlogName) {
                const posts = yield _04_postsQueryRepository_1.postsQueryRepository.getPostsIdByBlogId2(id);
                for (let post of posts) {
                    const newPost = yield _04_postsDbRepository_1.postsRepository.updatePost(post._id.toString(), {
                        title: post.title,
                        shortDescription: post.shortDescription,
                        content: post.content,
                        blogId: post.blogId,
                    }, currentBlogName);
                }
                ;
            }
            ;
            return updated;
        });
    },
    deleteBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleted = yield _02_blogsDbRepository_1.blogRepository.deleteBlogById(id);
            const posts = yield _04_postsQueryRepository_1.postsQueryRepository.getPostsIdByBlogId2(id);
            if (posts.length > 0) {
                for (let post of posts) {
                    const newPost = yield _04_postsDbRepository_1.postsRepository
                        .deletePostById(post._id.toString());
                }
                ;
            }
            ;
            return deleted;
        });
    },
    createPostsByBlogId(blogId, body) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield _04_postsServices_1.postsServices.createPost(Object.assign(Object.assign({}, body), { blogId }));
        });
    },
    deleteAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return _02_blogsDbRepository_1.blogRepository.deleteAll();
        });
    }
};
