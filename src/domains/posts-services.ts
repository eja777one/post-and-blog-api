import { blogServices } from './blogs-services';
import { PostInputModel } from '../models';
import { postsRepository } from '../repositories/posts-db-repository';

export const postsServices = {
    async getPostsByQuery(query: any) {
        return await postsRepository.getPostsByQuery(query);
    },

    async createPost(body: PostInputModel) {
        const blogName = await blogServices.getBlogById(body.blogId)
            .then(value => value ? value.name : '');
        const createdAt = new Date().toISOString();
        const post = { blogName, createdAt, ...body };

        return await postsRepository.createPost(post);
    },

    async getPostById(id: string) {
        return await postsRepository.getPostById(id);
    },

    async updatePost(id: string, body: PostInputModel) {
        const blogName = await blogServices.getBlogById(body.blogId)
            .then(value => value ? value.name : '');
        return await postsRepository.updatePost(id, body, blogName);
    },

    async deletePostById(id: string) {
        return await postsRepository.deletePostById(id);
    },

    async deleteAll() {
        return await postsRepository.deleteAll();
    }
};