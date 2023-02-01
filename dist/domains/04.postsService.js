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
exports.postsService = void 0;
const bson_1 = require("bson");
const _02_blogsQRepo_1 = require("../repositories/02.blogsQRepo");
const _04_postsDBRepo_1 = require("../repositories/04.postsDBRepo");
class PostsService {
    createPost(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const blogName = yield _02_blogsQRepo_1.blogsQueryRepository.getBlog(body.blogId)
                .then(value => value ? value.name : '');
            const post = {
                _id: new bson_1.ObjectID,
                blogName,
                createdAt: new Date().toISOString(),
                title: body.title,
                shortDescription: body.shortDescription,
                content: body.content,
                blogId: body.blogId
            };
            const postId = yield _04_postsDBRepo_1.postsRepository.createPost(post);
            return postId;
        });
    }
    updatePost(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const blogName = yield _02_blogsQRepo_1.blogsQueryRepository.getBlog(body.blogId)
                .then(value => value ? value.name : '');
            const updated = yield _04_postsDBRepo_1.postsRepository.updatePost(id, body, blogName);
            return updated;
        });
    }
    deletePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deletedPost = yield _04_postsDBRepo_1.postsRepository.deletePost(id);
            return deletedPost;
        });
    }
    deleteAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield _04_postsDBRepo_1.postsRepository.deleteAll();
            return result;
        });
    }
}
;
exports.postsService = new PostsService();
