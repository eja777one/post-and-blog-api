import { commentsQueryRepository } from './../repositories/comments-query-repository';
import { commentsRepository } from './../repositories/comments-db-repository';
import { commentsCollection } from '../repositories/db';
import { UserViewModel, CommentInputModel } from './../models';


export const commentsServices = {
  async addComment(user: UserViewModel, postId: string, content: CommentInputModel) {
    const createdAt = new Date().toISOString();
    const comment = {
      content: content.content,
      userId: user.id,
      userLogin: user.login,
      postId,
      createdAt
    };
    const commentId = await commentsRepository.addComment(comment);
    return commentId;
  },

  async updateComment(id: string, user: UserViewModel, content: CommentInputModel) {
    const comment = await commentsQueryRepository.getComment(id);
    if (!comment) return '404';
    else if (comment.userId !== user.id) return '403';

    const modComment = {
      content: content.content,
      userId: comment.userId,
      userLogin: comment.userLogin,
      createdAt: comment.createdAt
    }

    const result = await commentsRepository.updateComment(id, modComment);
    return (result >= 0) ? '204' : '404';
  },

  async deleteComment(id: string, user: UserViewModel) {
    const comment = await commentsQueryRepository.getComment(id);
    if (!comment) return '404';
    else if (comment.userId !== user.id) return '403';

    const result = await commentsRepository.deleteComment(id);
    return (result > 0) ? '204' : '404';
  },

  async deleteAll() {
    return await commentsRepository.deleteAll();
  }
};