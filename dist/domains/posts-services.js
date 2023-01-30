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
exports.postsServices = void 0;
const blogs_query_repository_1 = require("./../repositories/blogs-query-repository");
const posts_db_repository_1 = require("../repositories/posts-db-repository");
exports.postsServices = {
    createPost(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const blogName = yield blogs_query_repository_1.blogsQueryRepository.getBlogById(body.blogId)
                .then(value => value ? value.name : '');
            if (!blogName)
                return null;
            const createdAt = new Date().toISOString();
            const post = Object.assign({ blogName, createdAt }, body);
            return yield posts_db_repository_1.postsRepository.createPost(post);
        });
    },
    updatePost(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const blogName = yield blogs_query_repository_1.blogsQueryRepository.getBlogById(body.blogId)
                .then(value => value ? value.name : '');
            return yield posts_db_repository_1.postsRepository.updatePost(id, body, blogName);
        });
    },
    deletePostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deletedPost = yield posts_db_repository_1.postsRepository.deletePostById(id);
            return deletedPost;
        });
    },
    deleteAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield posts_db_repository_1.postsRepository.deleteAll();
        });
    }
};
