import { postsServices } from './posts-services';
import { blogRepository } from "../repositories/blogs-db-repository";
import { postsRepository } from "../repositories/posts-db-repository";
import { BlogInputModel } from "../models";

export const blogServices = {
    async getBlogsByQuery(query: any) {
        const blogs = await blogRepository.getBlogsByQuery(query);
        return blogs;
    },

    async createBlog(body: BlogInputModel) {
        const createdAt = new Date().toISOString();
        const blog = { createdAt, ...body };
        return await blogRepository.createBlog(blog);
    },

    async getBlogById(id: string) {
        return await blogRepository.getBlogById(id);
    },

    async updateBlog(id: string, body: BlogInputModel) {
        return await blogRepository.updateBlog(id, body);
    },

    async deleteBlogById(id: string) {
        return await blogRepository.deleteBlogById(id);
    },

    async getBlogs() {
        return await blogRepository.getBlogs();
    },

    async getPostsByBlogId(id: string, query: any) {
        return await postsRepository.getPostsByBlogId(id, query);
    },

    async createPostsByBlogId(blogId: string, body: any) {
        return await postsServices.createPost({ ...body, blogId })
    },

    async deleteAll() {
        return blogRepository.deleteAll();
    }
};