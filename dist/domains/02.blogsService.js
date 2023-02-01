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
exports.blogService = void 0;
const _02_blogsQRepo_1 = require("../repositories/02.blogsQRepo");
const _02_blogsDBRepo_1 = require("../repositories/02.blogsDBRepo");
const _04_postsDBRepo_1 = require("../repositories/04.postsDBRepo");
const _04_postsQRepo_1 = require("../repositories/04.postsQRepo");
const _04_postsService_1 = require("./04.postsService");
const mongodb_1 = require("mongodb");
class BlogService {
    createBlog(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const blogInput = {
                _id: new mongodb_1.ObjectId(),
                name: body.name,
                description: body.description,
                websiteUrl: body.websiteUrl,
                createdAt: new Date().toISOString()
            };
            const blogId = yield _02_blogsDBRepo_1.blogsRepository.createBlog(blogInput);
            return blogId;
        });
    }
    updateBlog(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield _02_blogsQRepo_1.blogsQueryRepository.getBlog(id);
            if (!blog)
                return null;
            const updated = yield _02_blogsDBRepo_1.blogsRepository.updateBlog(id, body);
            const blogsNameWasChanged = blog.name === body.name;
            if (!blogsNameWasChanged)
                return updated;
            const posts = yield _04_postsQRepo_1.postsQueryRepository.getAllPostsByBlogId(id);
            for (let post of posts) {
                yield _04_postsDBRepo_1.postsRepository.updatePostsBlogName(post._id.toString(), body.name);
            }
            ;
            return updated;
        });
    }
    deleteBlog(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleted = yield _02_blogsDBRepo_1.blogsRepository.deleteBlog(id);
            const posts = yield _04_postsQRepo_1.postsQueryRepository.getAllPostsByBlogId(id);
            if (posts.length === 0)
                return deleted;
            for (let post of posts) {
                yield _04_postsDBRepo_1.postsRepository.deletePost(post._id.toString());
            }
            ;
            return deleted;
        });
    }
    createPostsByBlogId(blogId, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const blogName = yield _02_blogsQRepo_1.blogsQueryRepository.getBlog(blogId)
                .then(value => value ? value.name : '');
            if (!blogName)
                return null;
            const post = {
                blogId,
                title: body.title,
                shortDescription: body.shortDescription,
                content: body.content
            };
            const postId = yield _04_postsService_1.postsService.createPost(post);
            return postId;
        });
    }
    deleteAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield _02_blogsDBRepo_1.blogsRepository.deleteAll();
            return result;
        });
    }
}
;
exports.blogService = new BlogService();
