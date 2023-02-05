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
exports.CommentsRepository = void 0;
const bson_1 = require("bson");
const _00_db_1 = require("./00.db");
class CommentsRepository {
    addComment(comment) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield _00_db_1.CommentModel.collection.insertOne(comment);
            return result.insertedId.toString();
        });
    }
    updateComment(id, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield _00_db_1.CommentModel.updateOne({ _id: new bson_1.ObjectID(id) }, { $set: { content } });
            return result.matchedCount === 1;
        });
    }
    updateLikeStatus(id, likesData) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield _00_db_1.CommentModel.updateOne({ _id: new bson_1.ObjectID(id) }, {
                $set: {
                    likesCount: likesData.likesCount,
                    dislikesCount: likesData.dislikesCount,
                    myStatus: likesData.myStatus
                }
            });
            return result.modifiedCount === 1;
        });
    }
    deleteComment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield _00_db_1.CommentModel.deleteOne({ _id: new bson_1.ObjectID(id) });
            return result.deletedCount === 1;
        });
    }
    deleteAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield _00_db_1.CommentModel.deleteMany({});
            return result.deletedCount;
        });
    }
}
exports.CommentsRepository = CommentsRepository;
;
