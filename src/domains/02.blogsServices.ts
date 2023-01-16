import { postsQueryRepository } from '../repositories/04.postsQueryRepository';
import { blogsQueryRepository } from '../repositories/02.blogsQueryRepository';
import { postsServices } from './04.postsServices';
import { blogRepository } from "../repositories/02.blogsDbRepository";
import { BlogInputModel } from "../models";
import { postsRepository } from '../repositories/04.postsDbRepository';

export const blogServices = {
	async createBlog(body: BlogInputModel) {
		const createdAt = new Date().toISOString();
		const blog = { createdAt, ...body };
		return await blogRepository.createBlog(blog);
	},

	async updateBlog(id: string, body: BlogInputModel) {
		const blog = await blogsQueryRepository.getBlogById(id);
		if (!blog) return null;
		const lastBlogName = blog.name;
		const updated = await blogRepository.updateBlog(id, body);
		const currentBlogName = body.name;
		if (lastBlogName !== currentBlogName) {
			const posts = await postsQueryRepository.getPostsIdByBlogId2(id);
			for (let post of posts) {
				const newPost = await postsRepository.updatePost(
					post._id.toString(),
					{
						title: post.title,
						shortDescription: post.shortDescription,
						content: post.content,
						blogId: post.blogId,
					},
					currentBlogName
				);
			};
		};
		return updated;
	},

	async deleteBlogById(id: string) {
		const deleted = await blogRepository.deleteBlogById(id);
		const posts = await postsQueryRepository.getPostsIdByBlogId2(id);
		if (posts.length > 0) {
			for (let post of posts) {
				const newPost = await postsRepository
					.deletePostById(post._id.toString());
			};
		};
		return deleted;
	},

	async createPostsByBlogId(blogId: string, body: any) {
		return await postsServices.createPost({ ...body, blogId })
	},

	async deleteAll() {
		return blogRepository.deleteAll();
	}
};