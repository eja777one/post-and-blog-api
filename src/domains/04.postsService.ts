import { ObjectID } from 'bson';
import { BlogsQueryRepository } from '../repositories/02.blogsQRepo';
import { PostsRepository } from '../repositories/04.postsDBRepo';
import { PostsQueryRepository } from './../repositories/04.postsQRepo';
import { PostInputModel, PostDBModel, Query, PostInputModelNoId } from '../models';
import { CommentsQueryRepository } from '../repositories/03.commentsQRepo';

export class PostsService {
	constructor(
		protected commentsQueryRepository: CommentsQueryRepository,
		protected blogsQueryRepository: BlogsQueryRepository,
		protected postsQueryRepository: PostsQueryRepository,
		protected postsRepository: PostsRepository,) { }

	async getPost(postId: string) {
		const post = this.postsQueryRepository.getPost(postId);
		return post;
	}

	async getPosts(query: Query) {
		const posts = this.postsQueryRepository.getPosts(query);
		return posts;
	}

	async getBlogsPosts(query: Query, blogId: string) {
		const blog = await this.blogsQueryRepository.getBlog(blogId);
		if (!blog) return null;

		const posts = await this.postsQueryRepository.getPosts(query, blogId);
		return posts;
	}

	async getPostsComments(query: Query, postId: string) {
		const post = await this.postsQueryRepository.getPost(postId);
		if (!post) return null;

		const comments = await this.commentsQueryRepository
			.getComments(query, postId);

		return comments;
	}

	// async createPostsComment() {

	// }

	async createPost(body: PostInputModel) {
		const blog = await this.blogsQueryRepository.getBlog(body.blogId);
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

		const postId = await this.postsRepository.createPost(post);
		const newPost = await this.postsQueryRepository.getPost(postId);

		return newPost;
	}

	async createBlogsPost(blogId: string, body: PostInputModelNoId) {
		const blogName = await this.blogsQueryRepository.getBlog(blogId)
			.then(value => value ? value.name : '');

		if (!blogName) return null;

		const postInput = new PostDBModel(
			new ObjectID,
			body.title,
			body.shortDescription,
			body.content,
			blogId,
			blogName,
			new Date().toISOString()
		);

		const postId = await this.postsRepository.createPost(postInput);
		const post = await this.postsQueryRepository.getPost(postId);
		return post;
	}

	async updatePost(id: string, body: PostInputModel) {
		const blog = await this.blogsQueryRepository.getBlog(body.blogId);
		if (!blog) return null;

		const updated = await this.postsRepository.updatePost(id, body, blog.name);
		return updated;
	}

	async deletePost(id: string) {
		const deletedPost = await this.postsRepository.deletePost(id);
		return deletedPost;
	}

	async deleteAll() {
		const result = await this.postsRepository.deleteAll();
		return result;
	}
};