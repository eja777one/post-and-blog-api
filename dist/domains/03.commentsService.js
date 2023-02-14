"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
const inversify_1 = require("inversify");
const bson_1 = require("bson");
const _03_commentsDBRepo_1 = require("../repositories/03.commentsDBRepo");
const _03_commentsQRepo_1 = require("../repositories/03.commentsQRepo");
const _04_postsQRepo_1 = require("../repositories/04.postsQRepo");
const models_1 = require("../models");
let CommentsService = class CommentsService {
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
    getComment(commentId, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield this.commentsQueryRepository
                .getComment(commentId, user === null || user === void 0 ? void 0 : user.id);
            if (!comment)
                return new models_1.BLLResponse(404);
            else
                return new models_1.BLLResponse(200, comment);
        });
    }
    addComment(user, postId, content) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!user)
                return new models_1.BLLResponse(401);
            const post = yield this.postsQueryRepository.getPost(postId);
            if (!post)
                return new models_1.BLLResponse(404);
            const comment = new models_1.CommentDBModel(new bson_1.ObjectID, content.content, user.id, user.login, new Date().toISOString(), postId, 0, 0, []);
            const commentId = yield this.commentsRepository.addComment(comment);
            const newComment = yield this.commentsQueryRepository.getComment(commentId);
            if (!newComment)
                return new models_1.BLLResponse(404);
            else
                return new models_1.BLLResponse(201, newComment);
        });
    }
    changeLikeStatus(commentId, likeStatus, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId)
                return new models_1.BLLResponse(401);
            const comment = yield this.commentsQueryRepository
                .getComment(commentId, userId);
            if (!comment)
                return new models_1.BLLResponse(404);
            if (comment.likesInfo.myStatus === likeStatus)
                return new models_1.BLLResponse(204);
            const likesData = {
                likesCount: comment.likesInfo.likesCount,
                dislikesCount: comment.likesInfo.dislikesCount,
                myStatus: comment.likesInfo.myStatus,
            };
            if (comment.likesInfo.myStatus === 'None' && likeStatus === 'Like') {
                likesData.likesCount += 1;
            }
            else if (comment.likesInfo.myStatus === 'Like' && likeStatus === 'None') {
                likesData.likesCount -= 1;
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
            const updated = yield this.commentsRepository
                .updateLikeStatus(commentId, likesData, userId);
            if (!updated)
                return new models_1.BLLResponse(404);
            else
                return new models_1.BLLResponse(204);
        });
    }
    updateComment(id, user, content) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!user)
                return new models_1.BLLResponse(401);
            const comment = yield this.commentsQueryRepository.getComment(id);
            if (!comment)
                return new models_1.BLLResponse(404);
            if (comment.commentatorInfo.userId !== user.id)
                return new models_1.BLLResponse(403);
            const updated = yield this.commentsRepository.
                updateComment(id, content.content);
            if (!updated)
                return new models_1.BLLResponse(404);
            else
                return new models_1.BLLResponse(204);
        });
    }
    deleteComment(id, user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!user)
                return new models_1.BLLResponse(401);
            const comment = yield this.commentsQueryRepository.getComment(id);
            if (!comment)
                return new models_1.BLLResponse(404);
            if (comment.commentatorInfo.userId !== user.id)
                return new models_1.BLLResponse(403);
            const deleted = yield this.commentsRepository.deleteComment(id);
            if (!deleted)
                return new models_1.BLLResponse(404);
            else
                return new models_1.BLLResponse(204);
        });
    }
    deleteAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.commentsRepository.deleteAll();
            return result;
        });
    }
};
CommentsService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(_03_commentsDBRepo_1.CommentsRepository)),
    __param(1, (0, inversify_1.inject)(_03_commentsQRepo_1.CommentsQueryRepository)),
    __param(2, (0, inversify_1.inject)(_04_postsQRepo_1.PostsQueryRepository)),
    __metadata("design:paramtypes", [_03_commentsDBRepo_1.CommentsRepository,
        _03_commentsQRepo_1.CommentsQueryRepository,
        _04_postsQRepo_1.PostsQueryRepository])
], CommentsService);
exports.CommentsService = CommentsService;
;
