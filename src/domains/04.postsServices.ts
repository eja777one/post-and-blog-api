import { postsQueryRepository } from '../repositories/04.postsQueryRepository';
import { commentsQueryRepository } from '../repositories/03.commentsQueryRepository';
import { blogsQueryRepository } from '../repositories/02.blogsQueryRepository';
import { PostInputModel } from '../models';
import { postsRepository } from '../repositories/04.postsDbRepository';

export const postsServices = {
    async createPost(body: PostInputModel) {
        const blogName = await blogsQueryRepository.getBlogById(body.blogId)
            .then(value => value ? value.name : '');
        if (!blogName) return null;
        const createdAt = new Date().toISOString();
        const post = { blogName, createdAt, ...body };

        return await postsRepository.createPost(post);
    },

    async updatePost(id: string, body: PostInputModel) {
        const blogName = await blogsQueryRepository.getBlogById(body.blogId)
            .then(value => value ? value.name : '');
        return await postsRepository.updatePost(id, body, blogName);
    },

    async deletePostById(id: string) {
        const deletedPost = await postsRepository.deletePostById(id);
        return deletedPost;
    },

    async deleteAll() {
        return await postsRepository.deleteAll();
    }
};