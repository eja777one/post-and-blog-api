import { ObjectID } from 'bson';
import { UserViewModel, CommentInputModel, CommentDBModel, Query }
  from '../models';
import { CommentsRepository } from '../repositories/03.commentsDBRepo';
import { CommentsQueryRepository } from '../repositories/03.commentsQRepo';
import { PostsQueryRepository } from '../repositories/04.postsQRepo';

export class CommentsService {

  commentsRepository: CommentsRepository;
  commentsQueryRepository: CommentsQueryRepository;
  postsQueryRepository: PostsQueryRepository;

  constructor() {
    this.commentsRepository = new CommentsRepository();
    this.commentsQueryRepository = new CommentsQueryRepository();
    this.postsQueryRepository = new PostsQueryRepository();
  }

  async getComments(query: Query, postId: string) {
    const comments = await this.commentsQueryRepository
      .getComments(query, postId);
    return comments;
  }

  async getComment(commentId: string) {
    const comment = await this.commentsQueryRepository.getComment(commentId);
    return comment;
  }

  async addComment(user: UserViewModel, postId: string,
    content: CommentInputModel) {

    const post = await this.postsQueryRepository.getPost(postId);
    if (!post) return null;

    const comment = new CommentDBModel(
      new ObjectID,
      content.content,
      user.id,
      user.login,
      new Date().toISOString(),
      postId
    );

    const commentId = await this.commentsRepository.addComment(comment);
    const newComment = await this.commentsQueryRepository.getComment(commentId);
    return newComment;
  }

  async updateComment(id: string, user: UserViewModel,
    content: CommentInputModel) {

    const comment = await this.commentsQueryRepository.getComment(id);

    if (!comment) return 'NOT_FOUND_404';
    if (comment.userId !== user.id) return 'FORBIDDEN_403';

    const updated = await this.commentsRepository.
      updateComment(id, content.content);

    return updated ? 'NO_CONTENT_204' : 'NOT_FOUND_404';
  }

  async deleteComment(id: string, user: UserViewModel) {

    const comment = await this.commentsQueryRepository.getComment(id);

    if (!comment) return 'NOT_FOUND_404';
    if (comment.userId !== user.id) return 'FORBIDDEN_403';

    const deleted = await this.commentsRepository.deleteComment(id);

    return deleted ? 'NO_CONTENT_204' : 'NOT_FOUND_404';
  }

  async deleteAll() {
    const result = await this.commentsRepository.deleteAll();
    return result;
  }
};