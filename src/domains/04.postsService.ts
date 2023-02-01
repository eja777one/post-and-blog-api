import { ObjectID } from 'bson';
import { blogsQueryRepository } from '../repositories/02.blogsQRepo';
import { postsRepository } from '../repositories/04.postsDBRepo';
import { PostInputModel, PostDBModel } from '../models';

class PostsService {

	async createPost(body: PostInputModel) {
		const blog = await blogsQueryRepository.getBlog(body.blogId);
		if (!blog) return null;

		const post = new PostDBModel(
			new ObjectID,
			body.title,
			body.shortDescription,
			body.content,
			body.blogId,
			blog.name,
			new Date().toISOString()
		);

		const postId = await postsRepository.createPost(post);
		return postId;
	}

	async updatePost(id: string, body: PostInputModel) {
		const blog = await blogsQueryRepository.getBlog(body.blogId);
		if (!blog) return null;

		const updated = await postsRepository.updatePost(id, body, blog.name);
		return updated;
	}

	async deletePost(id: string) {
		const deletedPost = await postsRepository.deletePost(id);
		return deletedPost;
	}

	async deleteAll() {
		const result = await postsRepository.deleteAll();
		return result;
	}
};

export const postsService = new PostsService();