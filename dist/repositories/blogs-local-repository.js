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
const randomizer = () => (Math.random() * 10000).toFixed(0);
const blogs = [
    {
        id: `b${randomizer()}`,
        name: 'name1',
        description: 'description1',
        websiteUrl: 'websiteUrl1',
    },
    {
        id: `b${randomizer()}`,
        name: 'name2',
        description: 'description2',
        websiteUrl: 'websiteUrl2',
    },
    {
        id: `b${randomizer()}`,
        name: 'name3',
        description: 'description3',
        websiteUrl: 'websiteUrl3',
    },
];
exports.blogRepository = {
    getBlogs() {
        return __awaiter(this, void 0, void 0, function* () { return blogs; });
    },
    createBlog(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = `b${randomizer()}`;
            const blog = Object.assign({ id }, body);
            blogs.push(blog);
            return blog;
        });
    },
    getBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return blogs.filter(blog => blog.id === id)[0];
        });
    },
    updateBlog(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            let blog = blogs.filter(blog => blog.id === id)[0];
            blog.name = body.name;
            blog.description = body.description;
            blog.websiteUrl = body.websiteUrl;
            return blog;
        });
    },
    deleteBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < blogs.length; i++) {
                if (blogs[i].id === id) {
                    blogs.splice(i, 1);
                    return;
                }
            }
        });
    },
    deleteAll() {
        return __awaiter(this, void 0, void 0, function* () { return blogs.splice(0); });
    }
};
