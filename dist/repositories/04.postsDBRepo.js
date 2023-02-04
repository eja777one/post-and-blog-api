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
exports.PostsRepository = void 0;
const _00_db_1 = require("./00.db");
const bson_1 = require("bson");
class PostsRepository {
    createPost(post) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield _00_db_1.PostModel.collection.insertOne(post);
            return result.insertedId.toString();
        });
    }
    updatePost(id, body, blogName) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield _00_db_1.PostModel.updateOne({ _id: new bson_1.ObjectID(id) }, {
                $set: {
                    title: body.title,
                    shortDescription: body.shortDescription,
                    content: body.content,
                    blogId: body.blogId,
                    blogName
                }
            });
            return result.matchedCount === 1;
        });
    }
    updatePostsBlogName(id, blogName) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield _00_db_1.PostModel.updateOne({ _id: new bson_1.ObjectID(id) }, { $set: { blogName } });
            return result.matchedCount === 1;
        });
    }
    deletePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield _00_db_1.PostModel.deleteOne({ _id: new bson_1.ObjectID(id) });
            return result.deletedCount === 1;
        });
    }
    deleteAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield _00_db_1.PostModel.deleteMany({});
            return result.deletedCount;
        });
    }
}
exports.PostsRepository = PostsRepository;
;
