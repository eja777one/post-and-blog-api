import { postsQueryRepository } from './../repositories/posts-query-repository';
import { commentsQueryRepository } from './../repositories/comments-query-repository';
import { blogsQueryRepository } from './../repositories/blogs-query-repository';
import { PostInputModel } from '../models';
import { postsRepository } from '../repositories/posts-db-repository';

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