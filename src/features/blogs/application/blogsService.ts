import { BlogModel } from './../../../db';
import { injectable, inject } from 'inversify';
import { BlogsQueryRepository } from '../infrastructure/blogsQRepo';
import { BlogsRepository } from "../infrastructure/blogsDBRepo";
import { PostsRepository } from '../../posts/infrastructure/postsDBRepo';
import { PostsQueryRepository } from '../../posts/infrastructure/postsQRepo';
import { BlogInputModel, Query, BLLResponse, BlogViewModel, Paginator }
	from "../../../models";

@injectable()
export class BlogsService {
	constructor(
		@inject(BlogsRepository) protected blogsRepository: BlogsRepository,
		@inject(PostsRepository) protected postsRepository: PostsRepository,
		@inject(PostsQueryRepository) protected postsQueryRepository:
			PostsQueryRepository,
		@inject(BlogsQueryRepository) protected blogsQueryRepository:
			BlogsQueryRepository,
	) { };

	async getBlog(blogId: string) {
		const blog = await this.blogsQueryRepository.getBlog(blogId);
		if (blog) return new BLLResponse<BlogViewModel>(200, blog);
		else return new BLLResponse<undefined>(404);
	};

	async getBlogs(query: Query) {
		const blogs = await this.blogsQueryRepository.getBlogs(query);
		return new BLLResponse<Paginator<BlogViewModel>>(200, blogs);
	};

	async createBlog(body: BlogInputModel) {
		const { name, description, websiteUrl } = body;
		const newBlog = BlogModel.makeBlog(name, description, websiteUrl);

		const blogId = await this.blogsRepository.save(newBlog);
		const blog = await this.blogsQueryRepository.getBlog(blogId);

		if (blog) return new BLLResponse<BlogViewModel>(201, blog);
		else return new BLLResponse<undefined>(404);
	}

	async updateBlog(id: string, body: BlogInputModel) {

		const blog = await this.blogsQueryRepository.getSmartBlog(id);
		if (!blog) return new BLLResponse<undefined>(404);

		blog.updateBlog(body.name, body.description, body.websiteUrl);
		await this.blogsRepository.save(blog);

		if (blog.name === body.name) return new BLLResponse<undefined>(204);

		const posts = await this.postsQueryRepository.getAllPostsByBlogId(id);

		for (let post of posts) {
			await this.postsRepository
				.updatePostsBlogName(post._id.toString(), body.name);
		};

		return new BLLResponse<undefined>(204);
	}

	async deleteBlog(id: string) {
		const deleted = await this.blogsRepository.deleteBlog(id);
		if (!deleted) return new BLLResponse<undefined>(404);

		const posts = await this.postsQueryRepository.getAllPostsByBlogId(id);
		if (posts.length === 0) return new BLLResponse<undefined>(204);

		for (let post of posts) {
			await this.postsRepository.deletePost(post._id.toString());
		};

		return new BLLResponse<undefined>(204);
	}

	async deleteAll() {
		const result = await this.blogsRepository.deleteAll();
		return result;
	}
};