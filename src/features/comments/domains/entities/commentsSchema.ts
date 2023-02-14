import { CommentModel } from './../../../../db';
import { CommentDBModel, LikeStatus } from './../../../../models';
import { HydratedDocument, Model, Schema } from "mongoose";

interface ICommentMethods {
  // someMethod(): null;
  updateComment(content: string): void;
  changeLikeStatus(likeStatus: LikeStatus, userId: string): boolean;
}

export interface ICommentDBModel
  extends Model<CommentDBModel, {}, ICommentMethods> {
  makeComment(content: string, userId: string, userLogin: string,
    postId: string): CommentDBModel;

  // someOtherMethod(): Promise<HydratedDocument<CommentDBModel,ICommentMethods>>
};

export const commentSchema = new Schema<CommentDBModel, ICommentDBModel>({
  content: { type: String, required: true },
  userId: { type: String, required: true },
  userLogin: { type: String, required: true },
  createdAt: { type: String, required: true },
  postId: { type: String, required: true },
  likesCount: { type: Number, required: true },
  dislikesCount: { type: Number, required: true },
  usersLikeStatus: []
});

commentSchema.static('makeComment', function makeComment(content: string,
  userId: string, userLogin: string, postId: string) {
  return new CommentModel({
    content: content,
    userId: userId,
    userLogin: userLogin,
    createdAt: new Date().toISOString(),
    postId: postId,
    likesCount: 0,
    dislikesCount: 0,
    usersLikeStatus: []
  });
});

commentSchema.method('updateComment', function updateComment(content: string) {
  this.content = content;
});

commentSchema.method('changeLikeStatus', function changeLikeStatus(
  likeStatus: LikeStatus, userId: string) {

  let currentStatus: LikeStatus = 'None';

  let findUsersLike = this.usersLikeStatus.find((el: any) =>
    (el.userId === userId));

  if (findUsersLike) currentStatus = findUsersLike.likeStatus;

  if (currentStatus === likeStatus) return false;

  if (currentStatus === 'None') {
    if (likeStatus === 'Like') this.likesCount += 1;
    if (likeStatus === 'Dislike') this.dislikesCount += 1;
  };

  if (currentStatus === 'Like') {
    if (likeStatus === 'None') this.likesCount -= 1;
    if (likeStatus === 'Dislike') {
      this.likesCount -= 1;
      this.dislikesCount += 1;
    };
  };

  if (currentStatus === 'Dislike') {
    if (likeStatus === 'None') this.dislikesCount -= 1;
    if (likeStatus === 'Like') {
      this.likesCount += 1;
      this.dislikesCount -= 1;
    };
  };

  if (!findUsersLike) this.usersLikeStatus.push({ userId, likeStatus });
  else {
    let j = 0;

    for (let i = 0; i < this.usersLikeStatus.length; i++) {
      if (this.usersLikeStatus[i].userId === userId) j = i
    };
    this.usersLikeStatus.splice(j, 1, { userId, likeStatus });
  };
  return true;
});