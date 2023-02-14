import { CommentModel } from './../../../db';
import { inject, injectable } from 'inversify';
import { CommentsRepository } from '../infrastructure/commentsDBRepo';
import { CommentsQueryRepository } from '../infrastructure/commentsQRepo';
import { PostsQueryRepository } from '../../posts/infrastructure/postsQRepo';
import {
  UserViewModel,
  CommentInputModel,
  CommentDBModel, Query,
  LikesInfoViewModel,
  BLLResponse,
  CommentViewModel
} from '../../../models';

@injectable()
export class CommentsService {
  constructor(
    @inject(CommentsRepository) protected commentsRepository:
      CommentsRepository,
    @inject(CommentsQueryRepository) protected commentsQueryRepository:
      CommentsQueryRepository,
    @inject(PostsQueryRepository) protected postsQueryRepository:
      PostsQueryRepository,
  ) { }

  async getComments(query: Query, postId: string) {
    const comments = await this.commentsQueryRepository
      .getComments(query, postId);
    return comments;
  }

  async getComment(commentId: string, user?: UserViewModel) {
    const comment = await this.commentsQueryRepository
      .getComment(commentId, user?.id);

    if (!comment) return new BLLResponse<undefined>(404);
    else return new BLLResponse<CommentViewModel>(200, comment);
  }

  async addComment(user: UserViewModel, postId: string,
    content: CommentInputModel) {

    if (!user) return new BLLResponse<undefined>(401);

    const post = await this.postsQueryRepository.getPost(postId);
    if (!post) return new BLLResponse<undefined>(404);

    const comment = CommentModel.makeComment(
      content.content,
      user.id,
      user.login,
      postId
    );

    const commentId = await this.commentsRepository.save(comment);
    const newComment = await this.commentsQueryRepository.getComment(commentId);

    if (!newComment) return new BLLResponse<undefined>(404);
    else return new BLLResponse<CommentViewModel>(201, newComment);
  }

  async changeLikeStatus(commentId: string,
    likeStatus: 'None' | 'Like' | 'Dislike', userId: string) {

    if (!userId) return new BLLResponse<undefined>(401);

    const comment = await this.commentsQueryRepository
      .getSmartComment(commentId); // like = None

    if (!comment) return new BLLResponse<undefined>(404);

    const updated = comment.changeLikeStatus(likeStatus, userId);

    await this.commentsRepository.save(comment);
    return new BLLResponse<undefined>(204);
  }

  async updateComment(id: string, user: UserViewModel,
    content: CommentInputModel) {
    if (!user) return new BLLResponse<undefined>(401);

    const comment = await this.commentsQueryRepository.getSmartComment(id);

    if (!comment) return new BLLResponse<undefined>(404);

    if (comment.userId !== user.id) return new BLLResponse<undefined>(403);

    comment.updateComment(content.content);

    const updated = await this.commentsRepository.save(comment);

    if (!updated) return new BLLResponse<undefined>(404);
    else return new BLLResponse<undefined>(204);
  }

  async deleteComment(id: string, user: UserViewModel) {
    if (!user) return new BLLResponse<undefined>(401);

    const comment = await this.commentsQueryRepository.getComment(id);

    if (!comment) return new BLLResponse<undefined>(404);
    if (comment.commentatorInfo.userId !== user.id)
      return new BLLResponse<undefined>(403);

    const deleted = await this.commentsRepository.deleteComment(id);

    if (!deleted) return new BLLResponse<undefined>(404);
    else return new BLLResponse<undefined>(204);
  }

  async deleteAll() {
    const result = await this.commentsRepository.deleteAll();
    return result;
  }
};