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
exports.postsQueryRepository = void 0;
const _00_db_1 = require("./00.db");
const bson_1 = require("bson");
const preparePost = (input) => {
    const obj = {
        id: input._id.toString(),
        title: input.title,
        shortDescription: input.shortDescription,
        content: input.content,
        blogId: input.blogId,
        blogName: input.blogName,
        createdAt: input.createdAt
    };
    return obj;
};
exports.postsQueryRepository = {
    getPostsByQuery(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (query.pageNumber - 1) * query.pageSize;
            const limit = query.pageSize;
            const sortBy = query.sortBy;
            const sortDirection = query.sortDirection === 'asc' ? 1 : -1;
            const sortObj = {};
            sortObj[sortBy] = sortDirection;
            const items = yield _00_db_1.PostModel.find({})
                .sort(sortObj)
                .limit(limit)
                .skip(skip)
                .lean();
            const postsCount = yield _00_db_1.PostModel.countDocuments();
            const pagesCount = Math.ceil(postsCount / limit);
            return {
                pagesCount,
                page: query.pageNumber,
                pageSize: query.pageSize,
                totalCount: postsCount,
                items: items.map((el) => preparePost(el))
            };
        });
    },
    getPostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield _00_db_1.PostModel
                .findOne({ _id: new bson_1.ObjectID(id) });
            if (post)
                return preparePost(post);
            else
                return null;
        });
    },
    getPostsByBlogId(id, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (query.pageNumber - 1) * query.pageSize;
            const limit = query.pageSize;
            const sortBy = query.sortBy;
            const sortDirection = query.sortDirection === 'asc' ? 1 : -1;
            const sortObj = {};
            sortObj[sortBy] = sortDirection;
            const findObj = { 'blogId': id };
            const items = yield _00_db_1.PostModel.find(findObj)
                .sort(sortObj)
                .limit(limit)
                .skip(skip)
                .lean();
            const postsCount = yield _00_db_1.PostModel.countDocuments(findObj);
            const pagesCount = Math.ceil(postsCount / limit);
            return {
                pagesCount,
                page: query.pageNumber,
                pageSize: query.pageSize,
                totalCount: postsCount,
                items: items.map((el) => preparePost(el))
            };
        });
    },
    getPostsIdByBlogId2(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const items = yield _00_db_1.PostModel
                .find({ 'blogId': id })
                .lean();
            return items;
        });
    },
};
