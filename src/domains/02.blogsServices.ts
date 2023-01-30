import { blogsQueryRepository } from '../repositories/02.blogsQueryRepository';
import { blogRepository } from "../repositories/02.blogsDbRepository";
import { postsRepository } from '../repositories/04.postsDbRepository';
import { postsQueryRepository } from '../repositories/04.postsQueryRepository';
import { postsServices } from './04.postsServices';
import { BlogInputModel, PostInputModelNoId } from "../models";

export const blogServices = {

	async createBlog(body: BlogInputModel) {

		const createdAt = new Date().toISOString();

		const blogInput = {
			name: body.name,
			description: body.description,
			websiteUrl: body.websiteUrl,
			createdAt
		};

		const blogId = await blogRepository.createBlog(blogInput);

		return blogId;
	},

	async updateBlog(id: string, body: BlogInputModel) {

		const blog = await blogsQueryRepository.getBlogById(id);
		if (!blog) return null;

		const lastBlogName = blog.name;

		const updated = await blogRepository.updateBlog(id, body);

		const currentBlogName = body.name;

		if (lastBlogName === currentBlogName) return updated;

		const posts = await postsQueryRepository
			.getRawPostsByBlogId(id);

		for (let post of posts) {
			await postsRepository.updatePostsBlogName(
				post._id.toString(),
				currentBlogName
			);
		};

		return updated;
	},

	async deleteBlogById(id: string) {
		const deleted = await blogRepository.deleteBlogById(id);

		const posts = await postsQueryRepository.getRawPostsByBlogId(id);

		if (posts.length === 0) return deleted;

		for (let post of posts) {
			await postsRepository.deletePostById(post._id.toString());
		};

		return deleted;
	},

	async createPostsByBlogId(blogId: string, body: PostInputModelNoId) {
		const blogName = await blogsQueryRepository.getBlogById(blogId)
			.then(value => value ? value.name : '');

		if (!blogName) return null;

		const post = {
			blogId,
			title: body.title,
			shortDescription: body.shortDescription,
			content: body.content
		};

		const postId = await postsServices.createPost(post);

		return postId;
	},

	async deleteAll() {
		const result = await blogRepository.deleteAll();
		return result;
	}
};