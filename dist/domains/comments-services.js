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
exports.commentsServices = void 0;
const comments_query_repository_1 = require("./../repositories/comments-query-repository");
const comments_db_repository_1 = require("./../repositories/comments-db-repository");
exports.commentsServices = {
    addComment(user, postId, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdAt = new Date().toISOString();
            const comment = {
                content: content.content,
                userId: user.id,
                userLogin: user.login,
                postId,
                createdAt
            };
            const commentId = yield comments_db_repository_1.commentsRepository.addComment(comment);
            return commentId;
        });
    },
    updateComment(id, user, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield comments_query_repository_1.commentsQueryRepository.getComment(id);
            if (!comment)
                return '404';
            else if (comment.userId !== user.id)
                return '403';
            const modComment = {
                content: content.content,
                userId: comment.userId,
                userLogin: comment.userLogin,
                createdAt: comment.createdAt
            };
            const result = yield comments_db_repository_1.commentsRepository.updateComment(id, modComment);
            return (result >= 0) ? '204' : '404';
        });
    },
    deleteComment(id, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield comments_query_repository_1.commentsQueryRepository.getComment(id);
            if (!comment)
                return '404';
            else if (comment.userId !== user.id)
                return '403';
            const result = yield comments_db_repository_1.commentsRepository.deleteComment(id);
            return (result > 0) ? '204' : '404';
        });
    },
    deleteAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield comments_db_repository_1.commentsRepository.deleteAll();
        });
    }
};
