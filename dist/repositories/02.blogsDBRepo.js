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
exports.BlogsRepository = void 0;
const _00_db_1 = require("./00.db");
const bson_1 = require("bson");
class BlogsRepository {
    createBlog(blog) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield _00_db_1.BlogModel.collection.insertOne(blog);
            return result.insertedId.toString();
        });
    }
    updateBlog(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield _00_db_1.BlogModel.updateOne({ _id: new bson_1.ObjectID(id) }, {
                $set: {
                    name: body.name,
                    description: body.description,
                    websiteUrl: body.websiteUrl,
                }
            });
            return result.modifiedCount === 1;
        });
    }
    deleteBlog(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield _00_db_1.BlogModel.deleteOne({ _id: new bson_1.ObjectID(id) });
            return result.deletedCount === 1;
        });
    }
    deleteAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield _00_db_1.BlogModel.deleteMany({});
            return result.deletedCount;
        });
    }
}
exports.BlogsRepository = BlogsRepository;
;
