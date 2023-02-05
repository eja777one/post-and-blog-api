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
class CommentsService {
    constructor(commentsRepository, commentsQueryRepository, postsQueryRepository) {
        this.commentsRepository = commentsRepository;
        this.commentsQueryRepository = commentsQueryRepository;
        this.postsQueryRepository = postsQueryRepository;
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
            const comment = new models_1.CommentDBModel(new bson_1.ObjectID, content.content, user.id, user.login, new Date().toISOString(), postId, 0, 0, 'None');
            const commentId = yield this.commentsRepository.addComment(comment);
            const newComment = yield this.commentsQueryRepository.getComment(commentId);
            return newComment;
        });
    }
    changeLikeStatus(commentId, likeStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield this.commentsQueryRepository.getComment(commentId);
            if (!comment)
                return null;
            if (comment.likesInfo.myStatus === likeStatus)
                return true;
            const likesData = {
                likesCount: comment.likesInfo.likesCount,
                dislikesCount: comment.likesInfo.dislikesCount,
                myStatus: comment.likesInfo.myStatus,
            };
            console.log(likesData);
            if (comment.likesInfo.myStatus === 'None' && likeStatus === 'Like') {
                likesData.likesCount += 1;
            }
            else if (comment.likesInfo.myStatus === 'Like' && likeStatus === 'None') {
                likesData.likesCount -= 1;
                console.log('hello1');
            }
            ;
            if (comment.likesInfo.myStatus === 'None' && likeStatus === 'Dislike') {
                likesData.dislikesCount += 1;
            }
            else if (comment.likesInfo.myStatus === 'Dislike' && likeStatus === 'None') {
                likesData.dislikesCount -= 1;
            }
            ;
            if (comment.likesInfo.myStatus === 'Like' && likeStatus === 'Dislike') {
                likesData.likesCount -= 1;
                likesData.dislikesCount += 1;
            }
            else if (comment.likesInfo.myStatus === 'Dislike' && likeStatus === 'Like') {
                likesData.likesCount += 1;
                likesData.dislikesCount -= 1;
            }
            ;
            likesData.myStatus = likeStatus;
            console.log(likesData);
            const updated = yield this.commentsRepository
                .updateLikeStatus(commentId, likesData);
            return updated;
        });
    }
    updateComment(id, user, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield this.commentsQueryRepository.getComment(id);
            if (!comment)
                return 'NOT_FOUND_404';
            if (comment.commentatorInfo.userId !== user.id)
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
            if (comment.commentatorInfo.userId !== user.id)
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
