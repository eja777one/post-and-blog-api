"use strict";
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
        console.log(blogs);
        return blogs;
    },
    addBlog(body) {
        const id = `b${randomizer()}`;
        const blog = Object.assign({ id }, body);
        blogs.push(blog);
        return blog;
    },
    getBlogById(id) {
        return blogs.filter(blog => blog.id === id)[0];
    },
    updateBlog(id, body) {
        let blog = blogs.filter(blog => blog.id === id)[0];
        blog.name = body.name;
        blog.description = body.description;
        blog.websiteUrl = body.websiteUrl;
        return blog;
    },
    deleteBlogById(id) {
        for (let i = 0; i < blogs.length; i++) {
            if (blogs[i].id === id) {
                blogs.splice(i, 1);
                return;
            }
        }
    },
    deleteAll() { return blogs.splice(0); }
};
