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
exports.commentsRepository = void 0;
const bson_1 = require("bson");
const db_1 = require("./db");
exports.commentsRepository = {
    addComment(comment) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.commentsCollection.insertOne(comment);
            return result.insertedId.toString();
        });
    },
    updateComment(id, comment) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.commentsCollection.updateOne({ _id: new bson_1.ObjectID(id) }, {
                $set: {
                    content: comment.content,
                    userId: comment.userId,
                    userLogin: comment.userLogin,
                    createdAt: comment.createdAt
                }
            });
            return result.modifiedCount;
        });
    },
    deleteComment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.commentsCollection.deleteOne({ _id: new bson_1.ObjectID(id) });
            return result.deletedCount;
        });
    },
    deleteAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.commentsCollection.deleteMany({});
            return result.deletedCount;
        });
    }
};
