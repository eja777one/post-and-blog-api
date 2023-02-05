import { ObjectID } from 'bson';
import { CommentsRepository } from '../repositories/03.commentsDBRepo';
import { CommentsQueryRepository } from '../repositories/03.commentsQRepo';
import { PostsQueryRepository } from '../repositories/04.postsQRepo';
import { UserViewModel, CommentInputModel, CommentDBModel, Query, LikesInfoViewModel }
  from '../models';

export class CommentsService {
  constructor(
    protected commentsRepository: CommentsRepository,
    protected commentsQueryRepository: CommentsQueryRepository,
    protected postsQueryRepository: PostsQueryRepository,
  ) { }

  async getComments(query: Query, postId: string) {
    const comments = await this.commentsQueryRepository
      .getComments(query, postId);
    return comments;
  }

  async getComment(commentId: string, user?: UserViewModel) {
    // if (user) {
    //   const comment = await this.commentsQueryRepository
    //     .getComment(commentId, user.id);
    // }

    const comment = await this.commentsQueryRepository.getComment(commentId, user?.id);
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
      postId,
      0,
      0,
      []
    );

    const commentId = await this.commentsRepository.addComment(comment);
    const newComment = await this.commentsQueryRepository.getComment(commentId);
    return newComment;
  }

  async changeLikeStatus(commentId: string,
    likeStatus: 'None' | 'Like' | 'Dislike', userId: string) {
    const comment = await this.commentsQueryRepository.getComment(commentId, userId);
    if (!comment) return null;
    if (comment.likesInfo.myStatus === likeStatus) return true;

    const likesData: LikesInfoViewModel = {
      likesCount: comment.likesInfo.likesCount,
      dislikesCount: comment.likesInfo.dislikesCount,
      myStatus: comment.likesInfo.myStatus,
    };

    if (comment.likesInfo.myStatus === 'None' && likeStatus === 'Like') {
      likesData.likesCount += 1;
    } else if (comment.likesInfo.myStatus === 'Like' && likeStatus === 'None') {
      likesData.likesCount -= 1;
    };

    if (comment.likesInfo.myStatus === 'None' && likeStatus === 'Dislike') {
      likesData.dislikesCount += 1;
    } else if (comment.likesInfo.myStatus === 'Dislike' && likeStatus === 'None') {
      likesData.dislikesCount -= 1;
    };

    if (comment.likesInfo.myStatus === 'Like' && likeStatus === 'Dislike') {
      likesData.likesCount -= 1;
      likesData.dislikesCount += 1;
    } else if (comment.likesInfo.myStatus === 'Dislike' && likeStatus === 'Like') {
      likesData.likesCount += 1;
      likesData.dislikesCount -= 1;
    };

    likesData.myStatus = likeStatus;

    const updated = await this.commentsRepository
      .updateLikeStatus(commentId, likesData, userId);

    return updated;
  }

  async updateComment(id: string, user: UserViewModel,
    content: CommentInputModel) {

    const comment = await this.commentsQueryRepository.getComment(id);

    if (!comment) return 'NOT_FOUND_404';
    if (comment.commentatorInfo.userId !== user.id) return 'FORBIDDEN_403';

    const updated = await this.commentsRepository.
      updateComment(id, content.content);

    return updated ? 'NO_CONTENT_204' : 'NOT_FOUND_404';
  }

  async deleteComment(id: string, user: UserViewModel) {

    const comment = await this.commentsQueryRepository.getComment(id);

    if (!comment) return 'NOT_FOUND_404';
    if (comment.commentatorInfo.userId !== user.id) return 'FORBIDDEN_403';

    const deleted = await this.commentsRepository.deleteComment(id);

    return deleted ? 'NO_CONTENT_204' : 'NOT_FOUND_404';
  }

  async deleteAll() {
    const result = await this.commentsRepository.deleteAll();
    return result;
  }
};