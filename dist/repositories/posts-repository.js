"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRepository = void 0;
const blogs_repository_1 = require("./blogs-repository");
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
    getPosts() { return posts; },
    createPost(body) {
        const blogName = blogs_repository_1.blogRepository.getBlogById(body.blogId).name;
        const id = `p${randomizer()}`;
        const post = Object.assign(Object.assign({ id }, body), { blogName });
        posts.push(post);
        return post;
    },
    getPostById(id) {
        const post = posts.filter(post => post.id === id);
        return post;
    },
    updatePost(id, body) {
        let post = posts.filter(post => post.id === id)[0];
        post.title = body.title;
        post.shortDescription = body.shortDescription;
        post.content = body.content;
        post.blogId = body.blogId;
        return post = Object.assign(Object.assign({}, post), body);
    },
    deletePostById(id) {
        for (let i = 0; i < posts.length; i++) {
            if (posts[i].id === id) {
                posts.splice(i, 1);
                return;
            }
        }
    },
    deleteAll() { return posts.splice(0); }
};
