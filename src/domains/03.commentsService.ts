import { CommentDBModel } from '../models';
import { ObjectID } from 'bson';
import { UserViewModel, CommentInputModel } from '../models';
import { commentsRepository } from '../repositories/03.commentsDBRepo';
import { commentsQueryRepository } from '../repositories/03.commentsQRepo';

class CommentsService {

  async addComment(user: UserViewModel, postId: string,
    content: CommentInputModel) {

    const comment = new CommentDBModel(
      new ObjectID,
      content.content,
      user.id,
      user.login,
      new Date().toISOString(),
      postId
    );

    const commentId = await commentsRepository.addComment(comment);
    return commentId;
  }

  async updateComment(id: string, user: UserViewModel,
    content: CommentInputModel) {

    const comment = await commentsQueryRepository.getComment(id);

    if (!comment) return 'NOT_FOUND_404';
    if (comment.userId !== user.id) return 'FORBIDDEN_403';

    const updated = await commentsRepository.updateComment(id, content.content);
    return updated ? 'NO_CONTENT_204' : 'NOT_FOUND_404';
  }

  async deleteComment(id: string, user: UserViewModel) {

    const comment = await commentsQueryRepository.getComment(id);

    if (!comment) return 'NOT_FOUND_404';
    if (comment.userId !== user.id) return 'FORBIDDEN_403';

    const deleted = await commentsRepository.deleteComment(id);

    return deleted ? 'NO_CONTENT_204' : 'NOT_FOUND_404';
  }

  async deleteAll() {
    const result = await commentsRepository.deleteAll();
    return result;
  }
};

export const commentsService = new CommentsService();