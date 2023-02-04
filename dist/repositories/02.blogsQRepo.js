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
exports.BlogsQueryRepository = void 0;
const _00_db_1 = require("./00.db");
const bson_1 = require("bson");
const prepareBlog = (input) => {
    return {
        id: input._id.toString(),
        name: input.name,
        description: input.description,
        websiteUrl: input.websiteUrl,
        createdAt: input.createdAt,
    };
};
class BlogsQueryRepository {
    getBlogs(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const sortBy = query.sortBy;
            const sortDirection = query.sortDirection === 'asc' ? 1 : -1;
            const sortObj = {};
            sortObj[sortBy] = sortDirection;
            const findObj = query.searchNameTerm ?
                { name: new RegExp(query.searchNameTerm, 'i') } : {};
            const items = yield _00_db_1.BlogModel.find(findObj)
                .sort(sortObj)
                .limit(query.pageSize)
                .skip((query.pageNumber - 1) * query.pageSize)
                .lean();
            const searchBlogsCount = yield _00_db_1.BlogModel.countDocuments(findObj);
            const pagesCount = Math.ceil(searchBlogsCount / query.pageSize);
            return {
                pagesCount,
                page: query.pageNumber,
                pageSize: query.pageSize,
                totalCount: searchBlogsCount,
                items: items.map((el) => prepareBlog(el))
            };
        });
    }
    getBlog(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield _00_db_1.BlogModel.findOne({ _id: new bson_1.ObjectID(id) });
            return blog ? prepareBlog(blog) : null;
        });
    }
}
exports.BlogsQueryRepository = BlogsQueryRepository;
;
