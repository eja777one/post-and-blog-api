import { blogsQueryRepository } from '../repositories/02.blogsQueryRepository';
import { postsRepository } from '../repositories/04.postsDbRepository';
import { PostInputModel } from '../models';

export const postsServices = {

	async createPost(body: PostInputModel) {

		const post = {
			blogName: body.blogId,
			createdAt: new Date().toISOString(),
			title: body.title,
			shortDescription: body.shortDescription,
			content: body.content,
			blogId: body.blogId
		};

		const postId = await postsRepository.createPost(post);

		return postId;
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
		const result = await postsRepository.deleteAll();
		return result;
	}
};