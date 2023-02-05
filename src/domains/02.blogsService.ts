import { BlogDBModel } from '../models';
import { BlogsQueryRepository } from '../repositories/02.blogsQRepo';
import { BlogsRepository } from "../repositories/02.blogsDBRepo";
import { PostsRepository } from '../repositories/04.postsDBRepo';
import { PostsQueryRepository } from '../repositories/04.postsQRepo';
import { BlogInputModel, Query } from "../models";
import { ObjectId } from 'mongodb';

export class BlogsService {
	constructor(
		protected blogsRepository: BlogsRepository,
		protected postsRepository: PostsRepository,
		protected postsQueryRepository: PostsQueryRepository,
		protected blogsQueryRepository: BlogsQueryRepository,
	) { }

	async getBlogs(query: Query) {
		const blogs = await this.blogsQueryRepository.getBlogs(query);
		return blogs;
	}

	async getBlog(blogId: string) {
		const blog = await this.blogsQueryRepository.getBlog(blogId);
		return blog;
	}

	async createBlog(body: BlogInputModel) {

		const blogInput = new BlogDBModel(
			new ObjectId(),
			body.name,
			body.description,
			body.websiteUrl,
			new Date().toISOString()
		);

		const blogId = await this.blogsRepository.createBlog(blogInput);
		const blog = await this.blogsQueryRepository.getBlog(blogId);
		return blog;
	}

	async updateBlog(id: string, body: BlogInputModel) {

		const blog = await this.blogsQueryRepository.getBlog(id);
		if (!blog) return null;

		const updated = await this.blogsRepository.updateBlog(id, body);

		const blogsNameWasChanged = blog.name === body.name;
		if (!blogsNameWasChanged) return updated;

		const posts = await this.postsQueryRepository.getAllPostsByBlogId(id);

		for (let post of posts) {
			await this.postsRepository
				.updatePostsBlogName(post._id.toString(), body.name);
		};

		return updated;
	}

	async deleteBlog(id: string) {
		const deleted = await this.blogsRepository.deleteBlog(id);

		const posts = await this.postsQueryRepository.getAllPostsByBlogId(id);

		if (posts.length === 0) return deleted;

		for (let post of posts) {
			await this.postsRepository.deletePost(post._id.toString());
		};

		return deleted;
	}

	async deleteAll() {
		const result = await this.blogsRepository.deleteAll();
		return result;
	}
};