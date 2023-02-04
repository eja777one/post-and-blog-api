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
exports.PostsQueryRepository = void 0;
const _00_db_1 = require("./00.db");
const bson_1 = require("bson");
const preparePost = (input) => {
    return {
        id: input._id.toString(),
        title: input.title,
        shortDescription: input.shortDescription,
        content: input.content,
        blogId: input.blogId,
        blogName: input.blogName,
        createdAt: input.createdAt
    };
};
class PostsQueryRepository {
    getPosts(query, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sortBy = query.sortBy;
            const sortDirection = query.sortDirection === 'asc' ? 1 : -1;
            const sortObj = {};
            sortObj[sortBy] = sortDirection;
            const findObj = blogId ? { blogId } : {};
            const items = yield _00_db_1.PostModel.find(findObj)
                .sort(sortObj)
                .limit(query.pageSize)
                .skip((query.pageNumber - 1) * query.pageSize)
                .lean();
            const postsCount = yield _00_db_1.PostModel.countDocuments(findObj);
            const pagesCount = Math.ceil(postsCount / query.pageSize);
            return {
                pagesCount,
                page: query.pageNumber,
                pageSize: query.pageSize,
                totalCount: postsCount,
                items: items.map((el) => preparePost(el))
            };
        });
    }
    getPost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield _00_db_1.PostModel.findOne({ _id: new bson_1.ObjectID(id) });
            return post ? preparePost(post) : null;
        });
    }
    getAllPostsByBlogId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const items = yield _00_db_1.PostModel.find({ 'blogId': id }).lean();
            return items;
        });
    }
}
exports.PostsQueryRepository = PostsQueryRepository;
;
