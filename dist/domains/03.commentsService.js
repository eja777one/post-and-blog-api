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
exports.commentsService = void 0;
const bson_1 = require("bson");
const _03_commentsDBRepo_1 = require("../repositories/03.commentsDBRepo");
const _03_commentsQRepo_1 = require("../repositories/03.commentsQRepo");
class CommentsService {
    addComment(user, postId, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = {
                _id: new bson_1.ObjectID,
                content: content.content,
                userId: user.id,
                userLogin: user.login,
                postId,
                createdAt: new Date().toISOString()
            };
            const commentId = yield _03_commentsDBRepo_1.commentsRepository.addComment(comment);
            return commentId;
        });
    }
    updateComment(id, user, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield _03_commentsQRepo_1.commentsQueryRepository.getComment(id);
            if (!comment)
                return 'NOT_FOUND_404';
            if (comment.userId !== user.id)
                return 'FORBIDDEN_403';
            const updated = yield _03_commentsDBRepo_1.commentsRepository.updateComment(id, content.content);
            return updated ? 'NO_CONTENT_204' : 'NOT_FOUND_404';
        });
    }
    deleteComment(id, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield _03_commentsQRepo_1.commentsQueryRepository.getComment(id);
            if (!comment)
                return 'NOT_FOUND_404';
            if (comment.userId !== user.id)
                return 'FORBIDDEN_403';
            const deleted = yield _03_commentsDBRepo_1.commentsRepository.deleteComment(id);
            return deleted ? 'NO_CONTENT_204' : 'NOT_FOUND_404';
        });
    }
    deleteAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield _03_commentsDBRepo_1.commentsRepository.deleteAll();
            return result;
        });
    }
}
;
exports.commentsService = new CommentsService();
