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
exports.PostsService = void 0;
const bson_1 = require("bson");
const models_1 = require("../models");
class PostsService {
    constructor(commentsQueryRepository, blogsQueryRepository, postsQueryRepository, postsRepository) {
        this.commentsQueryRepository = commentsQueryRepository;
        this.blogsQueryRepository = blogsQueryRepository;
        this.postsQueryRepository = postsQueryRepository;
        this.postsRepository = postsRepository;
    }
    getPost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = this.postsQueryRepository.getPost(postId);
            return post;
        });
    }
    getPosts(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const posts = this.postsQueryRepository.getPosts(query);
            return posts;
        });
    }
    getBlogsPosts(query, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield this.blogsQueryRepository.getBlog(blogId);
            if (!blog)
                return null;
            const posts = yield this.postsQueryRepository.getPosts(query, blogId);
            return posts;
        });
    }
    getPostsComments(query, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield this.postsQueryRepository.getPost(postId);
            if (!post)
                return null;
            const comments = yield this.commentsQueryRepository
                .getComments(query, postId);
            return comments;
        });
    }
    // async createPostsComment() {
    // }
    createPost(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield this.blogsQueryRepository.getBlog(body.blogId);
            if (!blog)
                return null;
            const post = new models_1.PostDBModel(new bson_1.ObjectID, body.title, body.shortDescription, body.content, body.blogId, blog.name, new Date().toISOString());
            const postId = yield this.postsRepository.createPost(post);
            const newPost = yield this.postsQueryRepository.getPost(postId);
            return newPost;
        });
    }
    createBlogsPost(blogId, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const blogName = yield this.blogsQueryRepository.getBlog(blogId)
                .then(value => value ? value.name : '');
            if (!blogName)
                return null;
            const postInput = new models_1.PostDBModel(new bson_1.ObjectID, body.title, body.shortDescription, body.content, blogId, blogName, new Date().toISOString());
            const postId = yield this.postsRepository.createPost(postInput);
            const post = yield this.postsQueryRepository.getPost(postId);
            return post;
        });
    }
    updatePost(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield this.blogsQueryRepository.getBlog(body.blogId);
            if (!blog)
                return null;
            const updated = yield this.postsRepository.updatePost(id, body, blog.name);
            return updated;
        });
    }
    deletePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deletedPost = yield this.postsRepository.deletePost(id);
            return deletedPost;
        });
    }
    deleteAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.postsRepository.deleteAll();
            return result;
        });
    }
}
exports.PostsService = PostsService;
;
