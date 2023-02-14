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
exports.CommentsRepository = void 0;
const bson_1 = require("bson");
const inversify_1 = require("inversify");
const _00_db_1 = require("./00.db");
let CommentsRepository = class CommentsRepository {
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
    updateLikeStatus(id, likesData, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const checkUser = yield _00_db_1.CommentModel.findOne({
                _id: new bson_1.ObjectID(id),
                usersLikeStatus: { $elemMatch: { userId } }
            });
            let result;
            if (!checkUser) {
                result = yield _00_db_1.CommentModel.updateOne({ _id: new bson_1.ObjectID(id) }, {
                    $push: {
                        usersLikeStatus: {
                            userId,
                            likeStatus: likesData.myStatus
                        }
                    },
                    $set: {
                        likesCount: likesData.likesCount,
                        dislikesCount: likesData.dislikesCount,
                    }
                });
            }
            else {
                result = yield _00_db_1.CommentModel.updateOne({
                    _id: new bson_1.ObjectID(id),
                    'usersLikeStatus.userId': userId
                }, {
                    $set: {
                        likesCount: likesData.likesCount,
                        dislikesCount: likesData.dislikesCount,
                        'usersLikeStatus.$.likeStatus': likesData.myStatus
                    }
                });
            }
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
};
CommentsRepository = __decorate([
    (0, inversify_1.injectable)()
], CommentsRepository);
exports.CommentsRepository = CommentsRepository;
;
