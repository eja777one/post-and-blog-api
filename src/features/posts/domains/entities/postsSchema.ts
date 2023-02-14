import { PostDBModel, LikeStatus } from './../../../../models';
import { HydratedDocument, Model, Schema } from "mongoose";
import { PostModel } from '../../../../db';

interface IPostMethods {
  // someMethod(): null;
  updatePost(title: string, shortDescription: string, content: string,
    blogId: string, blogName: string): void;
  changeLikeStatus(likeStatus: LikeStatus, userId: string,
    userLogin: string): boolean;
};

export interface IPostDBModel extends Model<PostDBModel, {}, IPostMethods> {
  makePost(title: string, shortDescription: string, content: string,
    blogId: string, blogName: string): PostDBModel;
  // someOtherMethod(): Promise<HydratedDocument<PostDBModel, IPostMethods>>
};

export const postSchema = new Schema<PostDBModel, IPostDBModel>({
  title: { type: String, required: true },
  shortDescription: { type: String, required: true },
  content: { type: String, required: true },
  blogId: { type: String, required: true },
  blogName: { type: String, required: true },
  createdAt: { type: String, required: true },
  likesCount: { type: Number, required: true },
  dislikesCount: { type: Number, required: true },
  usersLikeStatus: { type: [], required: true },
});

postSchema.static('makePost', function makePost(title: string,
  shortDescription: string, content: string, blogId: string, blogName: string) {
  return new PostModel({
    title: title,
    shortDescription: shortDescription,
    content: content,
    blogId: blogId,
    blogName: blogName,
    createdAt: new Date().toISOString(),
    likesCount: 0,
    dislikesCount: 0,
    usersLikeStatus: []
  });
});

postSchema.method('updatePost', function updatePostupdatePost(title: string,
  shortDescription: string, content: string, blogId: string, blogName: string) {
  this.title = title;
  this.shortDescription = shortDescription;
  this.content = content;
  this.blogId = blogId;
  this.blogName = blogName;
});

postSchema.method('changeLikeStatus', function changeLikeStatus(
  likeStatus: LikeStatus, userId: string, userLogin: string) {

  let currentStatus: LikeStatus = 'None';

  let findUsersLike = this.usersLikeStatus
    .find((el: any) => el.userId === userId);

  if (findUsersLike) currentStatus = findUsersLike.status;

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

  const likesData = {
    addedAt: new Date().toISOString(),
    userId: userId,
    login: userLogin,
    status: likeStatus
  };

  if (!findUsersLike) {
    this.usersLikeStatus.push(likesData);
  } else {
    let j = 0;

    let addedAt: string = '';

    for (let i = 0; i < this.usersLikeStatus.length; i++) {
      if (this.usersLikeStatus[i].userId === userId) {
        j = i;
        addedAt = this.usersLikeStatus[i].addedAt;
      }
    };
    this.usersLikeStatus.splice(j, 1, { ...likesData, addedAt });
  };
  return true;
});