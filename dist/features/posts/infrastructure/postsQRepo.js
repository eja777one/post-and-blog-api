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
exports.PostsQueryRepository = void 0;
const db_1 = require("../../../db");
const bson_1 = require("bson");
const inversify_1 = require("inversify");
const preparePost = (dbPost, userId) => {
    var _a;
    let status = 'None';
    const statusesArr = dbPost.usersLikeStatus;
    let newestDbArr = [];
    let newestArr = [];
    try {
        status = (_a = statusesArr.filter(el => el.userId === userId)[0]) === null || _a === void 0 ? void 0 : _a.status;
        newestDbArr = [...dbPost.usersLikeStatus];
        newestDbArr.sort((a, b) => (a.addedAt < b.addedAt) ? -1 : (a.addedAt > b.addedAt) ? 1 : 0);
        newestArr = newestDbArr.map(el => ({
            addedAt: el.addedAt,
            userId: el.userId,
            login: el.login
        }));
        newestArr.length = newestArr.length > 3 ? 3 : newestArr.length;
    }
    catch (error) {
        console.log('emptyArr');
    }
    ;
    return {
        id: dbPost._id.toString(),
        title: dbPost.title,
        shortDescription: dbPost.shortDescription,
        content: dbPost.content,
        blogId: dbPost.blogId,
        blogName: dbPost.blogName,
        createdAt: dbPost.createdAt,
        extendedLikesInfo: {
            likesCount: dbPost.likesCount,
            dislikesCount: dbPost.dislikesCount,
            myStatus: status ? status : 'None',
            newestLikes: statusesArr.length === 0 ? [] : newestArr
        }
    };
};
let PostsQueryRepository = class PostsQueryRepository {
    getPosts(query, blogId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sortBy = query.sortBy;
            const sortDirection = query.sortDirection === 'asc' ? 1 : -1;
            const sortObj = {};
            sortObj[sortBy] = sortDirection;
            const findObj = blogId ? { blogId } : {};
            const items = yield db_1.PostModel.find(findObj)
                .sort(sortObj)
                .limit(query.pageSize)
                .skip((query.pageNumber - 1) * query.pageSize)
                .lean();
            const postsCount = yield db_1.PostModel.countDocuments(findObj);
            const pagesCount = Math.ceil(postsCount / query.pageSize);
            return {
                pagesCount,
                page: query.pageNumber,
                pageSize: query.pageSize,
                totalCount: postsCount,
                items: items.map((el) => preparePost(el, userId))
            };
        });
    }
    getPost(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield db_1.PostModel.findOne({ _id: new bson_1.ObjectID(id) });
            return post ? preparePost(post, userId) : null;
        });
    }
    getSmartPost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield db_1.PostModel.findOne({ _id: new bson_1.ObjectID(id) });
            return post ? post : null;
        });
    }
    getAllPostsByBlogId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const items = yield db_1.PostModel.find({ 'blogId': id }).lean();
            return items;
        });
    }
};
PostsQueryRepository = __decorate([
    (0, inversify_1.injectable)()
], PostsQueryRepository);
exports.PostsQueryRepository = PostsQueryRepository;
;
