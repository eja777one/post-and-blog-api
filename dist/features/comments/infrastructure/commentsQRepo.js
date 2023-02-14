"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.CommentsQueryRepository = void 0;
const bson_1 = require("bson");
const inversify_1 = require("inversify");
const db_1 = require("../../../db");
const prepareComment = (dbComment, userId) => {
    var _a;
    let status = 'None';
    const statusesArr = dbComment.usersLikeStatus;
    try {
        status = (_a = statusesArr.filter(el => el.userId === userId)[0]) === null || _a === void 0 ? void 0 : _a.likeStatus;
    }
    catch (error) {
        console.log('emptyArr');
    }
    ;
    return {
        id: dbComment._id.toString(),
        content: dbComment.content,
        commentatorInfo: {
            userId: dbComment.userId,
            userLogin: dbComment.userLogin,
        },
        createdAt: dbComment.createdAt,
        likesInfo: {
            likesCount: dbComment.likesCount,
            dislikesCount: dbComment.dislikesCount,
            myStatus: status ? status : 'None'
        }
    };
};
let CommentsQueryRepository = class CommentsQueryRepository {
    getComment(commentId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield db_1.CommentModel.findOne({ _id: new bson_1.ObjectID(commentId) });
            return comment ? prepareComment(comment, userId) : null;
        });
    }
    getSmartComment(commentId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield db_1.CommentModel.findOne({ _id: new bson_1.ObjectID(commentId) });
            return comment ? comment : null;
        });
    }
    getComments(query, postId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sortBy = query.sortBy;
            const sortDirection = query.sortDirection === 'asc' ? 1 : -1;
            const sortObj = {};
            sortObj[sortBy] = sortDirection;
            const items = yield db_1.CommentModel.find({ postId: postId })
                .sort(sortObj)
                .limit(query.pageSize)
                .skip((query.pageNumber - 1) * query.pageSize)
                .lean();
            const postsCommentsCount = yield db_1.CommentModel
                .countDocuments({ postId: postId });
            const pagesCount = Math.ceil(postsCommentsCount / query.pageSize);
            return {
                pagesCount,
                page: query.pageNumber,
                pageSize: query.pageSize,
                totalCount: postsCommentsCount,
                items: items.map((el) => prepareComment(el, userId))
            };
        });
    }
};
CommentsQueryRepository = __decorate([
    (0, inversify_1.injectable)()
], CommentsQueryRepository);
exports.CommentsQueryRepository = CommentsQueryRepository;
;
