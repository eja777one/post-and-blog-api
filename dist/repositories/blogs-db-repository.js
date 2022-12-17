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
exports.blogRepository = void 0;
const db_1 = require("./db");
const randomizer = () => (Math.random() * 10000).toFixed(0);
exports.blogRepository = {
    getBlogs() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.blogsCollection.find({}).toArray();
        });
    },
    createBlog(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = `b${randomizer()}`;
            const blog = Object.assign({ id }, body);
            const result = yield db_1.blogsCollection.insertOne(blog);
            return blog;
        });
    },
    getBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield db_1.blogsCollection.findOne({ id: id }); // BAD
            return blog;
        });
    },
    updateBlog(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.blogsCollection.updateOne({ id: id }, {
                $set: {
                    name: body.name,
                    description: body.description,
                    websiteUrl: body.websiteUrl,
                }
            });
            return result.matchedCount === 1;
        });
    },
    deleteBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.blogsCollection.deleteOne({ id: id });
            return result.deletedCount === 1;
        });
    },
    deleteAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.blogsCollection.deleteMany({});
            const posts = yield db_1.blogsCollection.find({}).toArray();
            return posts.length === 0;
        });
    }
};
