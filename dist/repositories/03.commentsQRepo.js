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
exports.CommentsQueryRepository = void 0;
const bson_1 = require("bson");
const _00_db_1 = require("./00.db");
const prepareComment = (input) => {
    return {
        id: input._id.toString(),
        content: input.content,
        commentatorInfo: {
            userId: input.userId,
            userLogin: input.userLogin,
        },
        createdAt: input.createdAt,
        likesInfo: {
            likesCount: input.likesCount,
            dislikesCount: input.dislikesCount,
            myStatus: input.myStatus
        }
    };
};
class CommentsQueryRepository {
    getComment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield _00_db_1.CommentModel.findOne({ _id: new bson_1.ObjectID(id) });
            return comment ? prepareComment(comment) : null;
        });
    }
    getComments(query, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sortBy = query.sortBy;
            const sortDirection = query.sortDirection === 'asc' ? 1 : -1;
            const sortObj = {};
            sortObj[sortBy] = sortDirection;
            const items = yield _00_db_1.CommentModel.find({ postId: postId })
                .sort(sortObj)
                .limit(query.pageSize)
                .skip((query.pageNumber - 1) * query.pageSize)
                .lean();
            const postsCommentsCount = yield _00_db_1.CommentModel
                .countDocuments({ postId: postId });
            const pagesCount = Math.ceil(postsCommentsCount / query.pageSize);
            return {
                pagesCount,
                page: query.pageNumber,
                pageSize: query.pageSize,
                totalCount: postsCommentsCount,
                items: items.map((el) => prepareComment(el))
            };
        });
    }
}
exports.CommentsQueryRepository = CommentsQueryRepository;
;
