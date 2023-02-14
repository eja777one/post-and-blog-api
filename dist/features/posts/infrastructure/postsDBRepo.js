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
exports.PostsRepository = void 0;
const db_1 = require("../../../db");
const bson_1 = require("bson");
const inversify_1 = require("inversify");
let PostsRepository = class PostsRepository {
    save(model) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield model.save();
            return result._id;
        });
    }
    // async createPost(post: PostDBModel) {
    //   const result = await PostModel.collection.insertOne(post);
    //   return result.insertedId.toString();
    // }
    // async updatePost(id: string, body: PostInputModel, blogName: string) {
    //   const result = await PostModel.updateOne({ _id: new ObjectID(id) },
    //     {
    //       $set: {
    //         title: body.title,
    //         shortDescription: body.shortDescription,
    //         content: body.content,
    //         blogId: body.blogId,
    //         blogName
    //       }
    //     });
    //   return result.matchedCount === 1;
    // }
    updatePostsBlogName(id, blogName) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.PostModel.updateOne({ _id: new bson_1.ObjectID(id) }, { $set: { blogName } });
            return result.matchedCount === 1;
        });
    }
    deletePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.PostModel.deleteOne({ _id: new bson_1.ObjectID(id) });
            return result.deletedCount === 1;
        });
    }
    deleteAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.PostModel.deleteMany({});
            return result.deletedCount;
        });
    }
};
PostsRepository = __decorate([
    (0, inversify_1.injectable)()
], PostsRepository);
exports.PostsRepository = PostsRepository;
;
