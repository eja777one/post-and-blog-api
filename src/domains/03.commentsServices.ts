import { commentsQueryRepository } from '../repositories/03.commentsQueryRepository';
import { commentsRepository } from '../repositories/03.commentsDbRepository';
import { UserViewModel, CommentInputModel } from '../models';

export const commentsServices = {
  async addComment(user: UserViewModel, postId: string, content: CommentInputModel) {

    const comment = {
      content: content.content,
      userId: user.id,
      userLogin: user.login,
      postId,
      createdAt: new Date().toISOString()
    };

    const commentId = await commentsRepository.addComment(comment);

    return commentId;
  },

  async updateComment(id: string, user: UserViewModel, content: CommentInputModel) {

    const comment = await commentsQueryRepository.getComment(id);

    if (!comment) return 'NOT_FOUND_404';
    if (comment.userId !== user.id) return 'FORBIDDEN_403';

    const modComment = {
      content: content.content,
      userId: comment.userId,
      userLogin: comment.userLogin,
      createdAt: comment.createdAt
    }

    const updated = await commentsRepository.updateComment(id, modComment);
    return updated ? 'NO_CONTENT_204' : 'NOT_FOUND_404';
  },

  async deleteComment(id: string, user: UserViewModel) {

    const comment = await commentsQueryRepository.getComment(id);

    if (!comment) return 'NOT_FOUND_404';
    if (comment.userId !== user.id) return 'FORBIDDEN_403';

    const deleted = await commentsRepository.deleteComment(id);

    return deleted ? 'NO_CONTENT_204' : 'NOT_FOUND_404';
  },

  async deleteAll() {
    const result = await commentsRepository.deleteAll();
    return result;
  }
};