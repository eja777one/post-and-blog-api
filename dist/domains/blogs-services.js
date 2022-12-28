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
const posts_query_repository_1 = require("./../repositories/posts-query-repository");
const blogs_query_repository_1 = require("./../repositories/blogs-query-repository");
const posts_services_1 = require("./posts-services");
const blogs_db_repository_1 = require("../repositories/blogs-db-repository");
const posts_db_repository_1 = require("../repositories/posts-db-repository");
exports.blogServices = {
    createBlog(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdAt = new Date().toISOString();
            const blog = Object.assign({ createdAt }, body);
            return yield blogs_db_repository_1.blogRepository.createBlog(blog);
        });
    },
    updateBlog(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield blogs_query_repository_1.blogsQueryRepository.getBlogById(id);
            if (!blog)
                return null;
            const lastBlogName = blog.name;
            const updated = yield blogs_db_repository_1.blogRepository.updateBlog(id, body);
            const currentBlogName = body.name;
            if (lastBlogName !== currentBlogName) {
                const posts = yield posts_query_repository_1.postsQueryRepository.getPostsIdByBlogId2(id);
                for (let post of posts) {
                    const newPost = yield posts_db_repository_1.postsRepository.updatePost(post._id.toString(), {
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
            const deleted = yield blogs_db_repository_1.blogRepository.deleteBlogById(id);
            const posts = yield posts_query_repository_1.postsQueryRepository.getPostsIdByBlogId2(id);
            if (posts.length > 0) {
                for (let post of posts) {
                    const newPost = yield posts_db_repository_1.postsRepository
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
            return yield posts_services_1.postsServices.createPost(Object.assign(Object.assign({}, body), { blogId }));
        });
    },
    deleteAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return blogs_db_repository_1.blogRepository.deleteAll();
        });
    }
};
