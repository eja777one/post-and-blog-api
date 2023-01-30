import { Paginator, PostViewModel, Query } from '../models';
import { PostModel } from './00.db';
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

  async getPostsByQuery(query: Query)
    : Promise<Paginator<PostViewModel>> {

    const sortBy = query.sortBy;
    const sortDirection = query.sortDirection === 'asc' ? 1 : -1;

    const sortObj: any = {};
    sortObj[sortBy] = sortDirection

    const items = await PostModel.find({})
      .sort(sortObj)
      .limit(query.pageSize)
      .skip((query.pageNumber - 1) * query.pageSize)
      .lean();

    const postsCount = await PostModel.countDocuments()

    const pagesCount = Math.ceil(postsCount / query.pageSize);

    return {
      pagesCount,
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: postsCount,
      items: items.map((el: any) => preparePost(el))
    };
  },

  async getPostById(id: string) {
    const post = await PostModel
      .findOne({ _id: new ObjectID(id) });

    return post ? preparePost(post) : null;
  },

  async getPostsByBlogId(id: string, query: Query)
    : Promise<Paginator<PostViewModel>> {

    const sortBy = query.sortBy;
    const sortDirection = query.sortDirection === 'asc' ? 1 : -1;

    const sortObj: any = {};
    sortObj[sortBy] = sortDirection;

    const items = await PostModel.find({ 'blogId': id })
      .sort(sortObj)
      .limit(query.pageSize)
      .skip((query.pageNumber - 1) * query.pageSize)
      .lean();

    const postsCount = await PostModel
      .countDocuments({ 'blogId': id });

    const pagesCount = Math.ceil(postsCount / query.pageSize);

    return {
      pagesCount,
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: postsCount,
      items: items.map((el: any) => preparePost(el))
    };
  },

  async getRawPostsByBlogId(id: string) {
    const items = await PostModel
      .find({ 'blogId': id }).lean();
    return items;
  },
};