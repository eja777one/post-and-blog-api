import { PostModel } from '../../../db';
import { ObjectID } from 'bson';
import { injectable } from 'inversify';
import {
  Paginator, PostViewModel, Query, PostDBModel, LikeStatus,
  LikeDetailsViewModelArr
} from '../../../models';

const preparePost = (dbPost: PostDBModel, userId?: string): PostViewModel => {
  let status: LikeStatus = 'None';

  const statusesArr = dbPost.usersLikeStatus;
  let newestDbArr = [];
  let newestArr: LikeDetailsViewModelArr = [];

  try {
    status = statusesArr.filter(el => el.userId === userId)[0]?.status;
    newestDbArr = statusesArr.filter(el => el.status === 'Like');

    newestDbArr.sort((a, b) =>
      ((a.addedAt > b.addedAt) ? -1 : (a.addedAt < b.addedAt) ? 1 : 0));

    newestArr = newestDbArr.map(el => ({
      addedAt: el.addedAt,
      userId: el.userId,
      login: el.login
    }));

    newestArr.length = newestArr.length > 3 ? 3 : newestArr.length

  } catch (error) {
    console.log('emptyArr')
  };

  return {
    id: dbPost._id.toString(),
    title: dbPost.title,
    shortDescription: dbPost.shortDescription,
    content: dbPost.content,
    blogId: dbPost.blogId,
    blogName: dbPost.blogName,
    createdAt: dbPost.createdAt,
    extendedLikesInfo: {
      likesCount: dbPost.likesCount,
      dislikesCount: dbPost.dislikesCount,
      myStatus: status ? status : 'None',
      newestLikes: statusesArr.length === 0 ? [] : newestArr
    }
  };
};

@injectable()
export class PostsQueryRepository {

  async getPosts(query: Query, blogId?: string, userId?: string)
    : Promise<Paginator<PostViewModel>> {

    const sortBy = query.sortBy;
    const sortDirection = query.sortDirection === 'asc' ? 1 : -1;

    const sortObj: any = {};
    sortObj[sortBy] = sortDirection

    const findObj = blogId ? { blogId } : {};

    const items = await PostModel.find(findObj)
      .sort(sortObj)
      .limit(query.pageSize)
      .skip((query.pageNumber - 1) * query.pageSize)
      .lean();

    const postsCount = await PostModel.countDocuments(findObj)

    const pagesCount = Math.ceil(postsCount / query.pageSize);

    return {
      pagesCount,
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: postsCount,
      items: items.map((el: any) => preparePost(el, userId))
    };
  }

  async getPost(id: string, userId?: string) {
    const post = await PostModel.findOne({ _id: new ObjectID(id) });
    return post ? preparePost(post, userId) : null;
  }

  async getSmartPost(id: string) {
    const post = await PostModel.findOne({ _id: new ObjectID(id) });
    return post ? post : null;
  }

  async getAllPostsByBlogId(id: string) {
    const items = await PostModel.find({ 'blogId': id }).lean();
    return items;
  }
};