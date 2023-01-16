import { Paginator, PostViewModel } from '../models';
import { postsCollection } from './00.db';
import { ObjectID } from 'bson';

const preparePost = (input: any) => {
  const obj = {
    id: input._id.toString(),
    title: input.title,
    shortDescription: input.shortDescription,
    content: input.content,
    blogId: input.blogId,
    blogName: input.blogName,
    createdAt: input.createdAt
  };
  return obj;
};

export const postsQueryRepository = {
  async getPostsByQuery(query: any)
    : Promise<Paginator<PostViewModel>> {
    const skip = (query.pageNumber - 1) * query.pageSize;
    const limit = query.pageSize;
    const sortBy = query.sortBy;
    const sortDirection = query.sortDirection === 'asc' ? 1 : -1;
    const sortObj: any = {};
    sortObj[sortBy] = sortDirection

    const items = await postsCollection.find({})
      .sort(sortObj)
      .limit(limit)
      .skip(skip)
      .toArray();

    const postsCount = await postsCollection.countDocuments()

    const pagesCount = Math.ceil(postsCount / limit);

    return {
      pagesCount,
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: postsCount,
      items: items.map((el: any) => preparePost(el))
    };
  },

  async getPostById(id: string) {
    const post = await postsCollection
      .findOne({ _id: new ObjectID(id) });
    if (post) return preparePost(post);
    else return null;
  },

  async getPostsByBlogId(id: string, query: any)
    : Promise<Paginator<PostViewModel>> {
    const skip = (query.pageNumber - 1) * query.pageSize;
    const limit = query.pageSize;
    const sortBy = query.sortBy;
    const sortDirection = query.sortDirection === 'asc' ? 1 : -1;
    const sortObj: any = {};
    sortObj[sortBy] = sortDirection
    const findObj = { 'blogId': id };

    const items = await postsCollection.find(findObj)
      .sort(sortObj)
      .limit(limit)
      .skip(skip)
      .toArray();

    const postsCount = await postsCollection.countDocuments(findObj);

    const pagesCount = Math.ceil(postsCount / limit);

    return {
      pagesCount,
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: postsCount,
      items: items.map((el: any) => preparePost(el))
    };
  },

  async getPostsIdByBlogId2(id: string) {
    const items = await postsCollection
      .find({ 'blogId': id })
      .toArray();

    return items;
  },
};