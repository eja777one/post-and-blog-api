import { inject, injectable } from 'inversify';
import { BlogsQueryRepository } from '../../blogs/infrastructure/blogsQRepo';
import { PostsRepository } from '../infrastructure/postsDBRepo';
import { PostsQueryRepository } from '../infrastructure/postsQRepo';
import { CommentsQueryRepository } from '../../comments/infrastructure/commentsQRepo';
import { PostModel } from '../../../db';
import {
	PostInputModel, LikeStatus, Query, PostInputModelNoId, BLLResponse,
	Paginator, PostViewModel, CommentViewModel
} from '../../../models';

@injectable()
export class PostsService {
	constructor(
		@inject(CommentsQueryRepository) protected commentsQueryRepository:
			CommentsQueryRepository,
		@inject(BlogsQueryRepository) protected blogsQueryRepository:
			BlogsQueryRepository,
		@inject(PostsQueryRepository) protected postsQueryRepository:
			PostsQueryRepository,
		@inject(PostsRepository) protected postsRepository: PostsRepository,
	) { }

	async getPost(postId: string, userId?: string) {
		const post = await this.postsQueryRepository.getPost(postId, userId);
		if (!post) return new BLLResponse<undefined>(404);
		else return new BLLResponse<PostViewModel>(200, post);
	}

	async getPosts(query: Query, userId?: string) {
		const posts = await this.postsQueryRepository
			.getPosts(query, undefined, userId);
		return new BLLResponse<Paginator<PostViewModel>>(200, posts);
	}

	async getBlogsPosts(query: Query, blogId: string, userId?: string) {
		const blog = await this.blogsQueryRepository.getBlog(blogId);
		if (!blog) return new BLLResponse<undefined>(404);

		const posts = await this.postsQueryRepository
			.getPosts(query, blogId, userId);
		return new BLLResponse<Paginator<PostViewModel>>(200, posts);
	}

	async getPostsComments(query: Query, postId: string, userId?: string) {
		const post = await this.postsQueryRepository.getPost(postId);
		if (!post) return new BLLResponse<undefined>(404);

		const comments = await this.commentsQueryRepository
			.getComments(query, postId, userId);

		return new BLLResponse<Paginator<CommentViewModel>>(200, comments);
	}

	async createPost(body: PostInputModel) {
		const blog = await this.blogsQueryRepository.getBlog(body.blogId);
		if (!blog) return new BLLResponse<undefined>(404);

		const post = PostModel.makePost(
			body.title,
			body.shortDescription,
			body.content,
			body.blogId,
			blog.name
		);

		const postId = await this.postsRepository.save(post);
		const newPost = await this.postsQueryRepository.getPost(postId);

		if (!newPost) return new BLLResponse<undefined>(404);
		else return new BLLResponse<PostViewModel>(201, newPost);
	}

	async createBlogsPost(blogId: string, body: PostInputModelNoId) {
		const blogName = await this.blogsQueryRepository.getBlog(blogId)
			.then(value => value ? value.name : '');

		if (!blogName) return new BLLResponse<undefined>(404);

		const postInput = PostModel.makePost(
			body.title,
			body.shortDescription,
			body.content,
			blogId,
			blogName
		);

		const postId = await this.postsRepository.save(postInput);
		const post = await this.postsQueryRepository.getPost(postId);
		if (post) return new BLLResponse<PostViewModel>(201, post);
		else return new BLLResponse<undefined>(404);
	}

	async updatePost(id: string, body: PostInputModel) {
		const blog = await this.blogsQueryRepository.getBlog(body.blogId);
		if (!blog) return new BLLResponse<undefined>(404);

		const post = await this.postsQueryRepository.getSmartPost(id);
		if (!post) return new BLLResponse<undefined>(404);

		post.updatePost(
			body.title,
			body.shortDescription,
			body.content,
			body.blogId,
			blog.name
		);

		const result = await this.postsRepository.save(post);

		if (!result) return new BLLResponse<undefined>(404);
		else return new BLLResponse<undefined>(204);
	}

	async deletePost(id: string) {
		const deletedPost = await this.postsRepository.deletePost(id);
		if (!deletedPost) return new BLLResponse<undefined>(404);
		else return new BLLResponse<undefined>(204);
	}

	async changeLikeStatus(postId: string, likeStatus: LikeStatus, userId: string,
		userLogin: string) {
		if (!userId) return new BLLResponse<undefined>(401);

		const post = await this.postsQueryRepository
			.getSmartPost(postId);

		if (!post) return new BLLResponse<undefined>(404);

		const updated = post.changeLikeStatus(likeStatus, userId, userLogin);
		await this.postsRepository.save(post);
		return new BLLResponse<undefined>(204);
	}

	async deleteAll() {
		const result = await this.postsRepository.deleteAll();
		return result;
	}
};