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
const blogs_db_repository_1 = require("./blogs-db-repository");
const randomizer = () => (Math.random() * 10000).toFixed(0);
const options = {
    projection: {
        _id: 0,
        id: 1,
        title: 1,
        shortDescription: 1,
        content: 1,
        blogId: 1,
        blogName: 1,
        createdAt: 1,
    }
};
exports.postsRepository = {
    getPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.postsCollection.find({}, options).toArray();
        });
    },
    createPost(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const blogName = yield blogs_db_repository_1.blogRepository.getBlogById(body.blogId).then(value => value.name);
            const id = `p${randomizer()}`;
            const createdAt = new Date().toISOString();
            const post = Object.assign({ id, blogName, createdAt }, body);
            const result = yield db_1.postsCollection.insertOne(post);
            return this.getPostById(post.id);
        });
    },
    getPostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield db_1.postsCollection.findOne({ id: id }, options);
            return post;
        });
    },
    updatePost(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const blogName = yield blogs_db_repository_1.blogRepository.getBlogById(body.blogId).then(value => value.name);
            const result = yield db_1.postsCollection.updateOne({ id: id }, {
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
            const result = yield db_1.postsCollection.deleteOne({ id: id });
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
