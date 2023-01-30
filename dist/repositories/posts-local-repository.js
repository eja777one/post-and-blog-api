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
const blogs_local_repository_1 = require("./blogs-local-repository");
const randomizer = () => (Math.random() * 10000).toFixed(0);
const posts = [
    {
        id: `p${randomizer()}`,
        title: 'title1',
        shortDescription: 'shortDescription1',
        content: 'content1',
        blogId: 'blogId1',
        blogName: 'blogName1',
    },
    {
        id: `p${randomizer()}`,
        title: 'title2',
        shortDescription: 'shortDescription2',
        content: 'content2',
        blogId: 'blogId2',
        blogName: 'blogName2',
    },
    {
        id: `p${randomizer()}`,
        title: 'title3',
        shortDescription: 'shortDescription3',
        content: 'content3',
        blogId: 'blogId3',
        blogName: 'blogName3',
    },
];
exports.postsRepository = {
    getPosts() {
        return __awaiter(this, void 0, void 0, function* () { return posts; });
    },
    createPost(body) {
        return __awaiter(this, void 0, void 0, function* () {
            // const blogName = await blogRepository.getBlogById(body.blogId).name;
            const blogName = yield blogs_local_repository_1.blogRepository.getBlogById(body.blogId).then(value => value.name);
            const id = `p${randomizer()}`;
            const post = Object.assign({ id, blogName }, body);
            posts.push(post);
            return post;
        });
    },
    getPostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = posts.filter(post => post.id === id)[0];
            return post;
        });
    },
    updatePost(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            let post = posts.filter(post => post.id === id)[0];
            post.title = body.title;
            post.shortDescription = body.shortDescription;
            post.content = body.content;
            post.blogId = body.blogId;
            return post = Object.assign(Object.assign({}, post), body);
        });
    },
    deletePostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < posts.length; i++) {
                if (posts[i].id === id) {
                    posts.splice(i, 1);
                    return;
                }
            }
        });
    },
    deleteAll() {
        return __awaiter(this, void 0, void 0, function* () { return posts.splice(0); });
    }
};
