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
exports.CommentsService = void 0;
const bson_1 = require("bson");
const models_1 = require("../models");
const _03_commentsDBRepo_1 = require("../repositories/03.commentsDBRepo");
const _03_commentsQRepo_1 = require("../repositories/03.commentsQRepo");
const _04_postsQRepo_1 = require("../repositories/04.postsQRepo");
class CommentsService {
    constructor() {
        this.commentsRepository = new _03_commentsDBRepo_1.CommentsRepository();
        this.commentsQueryRepository = new _03_commentsQRepo_1.CommentsQueryRepository();
        this.postsQueryRepository = new _04_postsQRepo_1.PostsQueryRepository();
    }
    getComments(query, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const comments = yield this.commentsQueryRepository
                .getComments(query, postId);
            return comments;
        });
    }
    getComment(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield this.commentsQueryRepository.getComment(commentId);
            return comment;
        });
    }
    addComment(user, postId, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield this.postsQueryRepository.getPost(postId);
            if (!post)
                return null;
            const comment = new models_1.CommentDBModel(new bson_1.ObjectID, content.content, user.id, user.login, new Date().toISOString(), postId);
            const commentId = yield this.commentsRepository.addComment(comment);
            const newComment = yield this.commentsQueryRepository.getComment(commentId);
            return newComment;
        });
    }
    updateComment(id, user, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield this.commentsQueryRepository.getComment(id);
            if (!comment)
                return 'NOT_FOUND_404';
            if (comment.userId !== user.id)
                return 'FORBIDDEN_403';
            const updated = yield this.commentsRepository.
                updateComment(id, content.content);
            return updated ? 'NO_CONTENT_204' : 'NOT_FOUND_404';
        });
    }
    deleteComment(id, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield this.commentsQueryRepository.getComment(id);
            if (!comment)
                return 'NOT_FOUND_404';
            if (comment.userId !== user.id)
                return 'FORBIDDEN_403';
            const deleted = yield this.commentsRepository.deleteComment(id);
            return deleted ? 'NO_CONTENT_204' : 'NOT_FOUND_404';
        });
    }
    deleteAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.commentsRepository.deleteAll();
            return result;
        });
    }
}
exports.CommentsService = CommentsService;
;
