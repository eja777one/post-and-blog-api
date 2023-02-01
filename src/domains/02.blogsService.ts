import { BlogDBModel, PostInputModel } from '../models';
import { blogsQueryRepository } from '../repositories/02.blogsQRepo';
import { blogsRepository } from "../repositories/02.blogsDBRepo";
import { postsRepository } from '../repositories/04.postsDBRepo';
import { postsQueryRepository } from '../repositories/04.postsQRepo';
import { postsService } from './04.postsService';
import { BlogInputModel, PostInputModelNoId } from "../models";
import { ObjectId } from 'mongodb';

class BlogService {

	async createBlog(body: BlogInputModel) {

		const blogInput = new BlogDBModel(
			new ObjectId(),
			body.name,
			body.description,
			body.websiteUrl,
			new Date().toISOString()
		);

		const blogId = await blogsRepository.createBlog(blogInput);

		return blogId;
	}

	async updateBlog(id: string, body: BlogInputModel) {

		const blog = await blogsQueryRepository.getBlog(id);
		if (!blog) return null;

		const updated = await blogsRepository.updateBlog(id, body);

		const blogsNameWasChanged = blog.name === body.name;
		if (!blogsNameWasChanged) return updated;

		const posts = await postsQueryRepository.getAllPostsByBlogId(id);

		for (let post of posts) {
			await postsRepository.updatePostsBlogName(post._id.toString(), body.name);
		};

		return updated;
	}

	async deleteBlog(id: string) {
		const deleted = await blogsRepository.deleteBlog(id);

		const posts = await postsQueryRepository.getAllPostsByBlogId(id);

		if (posts.length === 0) return deleted;

		for (let post of posts) {
			await postsRepository.deletePost(post._id.toString());
		};

		return deleted;
	}

	async createPostsByBlogId(blogId: string, body: PostInputModelNoId) {
		const blogName = await blogsQueryRepository.getBlog(blogId)
			.then(value => value ? value.name : '');

		if (!blogName) return null;

		const postInput = new PostInputModel(
			body.title,
			body.shortDescription,
			body.content,
			blogId
		);

		const postId = await postsService.createPost(postInput);
		return postId;
	}

	async deleteAll() {
		const result = await blogsRepository.deleteAll();
		return result;
	}
};

export const blogService = new BlogService();