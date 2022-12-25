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
exports.postsRepository = void 0;
const db_1 = require("./db");
const bson_1 = require("bson");
exports.postsRepository = {
    getPostsByBlogId(id, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (query.pageNumber - 1) * query.pageSize;
            const limit = query.pageSize;
            const sortBy = query.sortBy;
            const sortDirection = query.sortDirection === 'asc' ? 1 : -1;
            const sortObj = {};
            sortObj[sortBy] = sortDirection;
            const findObj = { 'blogId': id };
            const items = yield db_1.postsCollection.find(findObj)
                .sort(sortObj)
                .limit(limit)
                .skip(skip)
                .toArray();
            const items2 = yield db_1.postsCollection.find(findObj)
                .toArray();
            const pagesCount = Math.ceil(items2.length / limit);
            const answer = {
                pagesCount,
                page: query.pageNumber,
                pageSize: query.pageSize,
                totalCount: items2.length,
                items
            };
            return answer;
        });
    },
    getPostsByQuery(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (query.pageNumber - 1) * query.pageSize;
            const limit = query.pageSize;
            const sortBy = query.sortBy;
            const sortDirection = query.sortDirection === 'asc' ? 1 : -1;
            const sortObj = {};
            sortObj[sortBy] = sortDirection;
            const items = yield db_1.postsCollection.find({})
                .sort(sortObj)
                .limit(limit)
                .skip(skip)
                .toArray();
            const items2 = yield db_1.postsCollection.find()
                .toArray();
            const pagesCount = Math.ceil(items2.length / limit);
            const answer = {
                pagesCount,
                page: query.pageNumber,
                pageSize: query.pageSize,
                totalCount: items2.length,
                items
            };
            return answer;
        });
    },
    getPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = yield db_1.postsCollection.find({}).toArray();
            return items;
        });
    },
    createPost(post) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.postsCollection.insertOne(post);
            return this.getPostById(result.insertedId.toString());
        });
    },
    getPostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // const post = await postsCollection.findOne({ id: id }, opt);
            const post = yield db_1.postsCollection.findOne({ _id: new bson_1.ObjectID(id) });
            return post;
        });
    },
    updatePost(id, body, blogName) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.postsCollection.updateOne({ _id: new bson_1.ObjectID(id) }, {
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
    },
    deletePostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.postsCollection.deleteOne({ _id: new bson_1.ObjectID(id) });
            return result.deletedCount === 1;
        });
    },
    deleteAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.postsCollection.deleteMany({});
            const posts = yield db_1.postsCollection.find({}).toArray();
            return posts.length === 0;
        });
    }
};
