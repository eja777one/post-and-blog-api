import { PostDBModel } from './../models';
import { Paginator, PostViewModel } from '../models';
import { postsCollection } from './db';
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
  async getPostsByQuery(query: any) {
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

    const items2 = await this.getPosts();

    const pagesCount = Math.ceil(items2.length / limit);

    const answer: Paginator<PostViewModel> = {
      pagesCount,
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: items2.length,
      items: items.map((el: any) => preparePost(el))
    }

    return answer;
  },

  async getPostById(id: string) {
    const post = await postsCollection
      .findOne({ _id: new ObjectID(id) });
    if (post) return preparePost(post);
    else return null;
  },

  async getPostsByBlogId(id: string, query: any) {
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

    const items2 = await this.getPosts();

    const pagesCount = Math.ceil(items2.length / limit);

    const answer: Paginator<PostViewModel> = {
      pagesCount,
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: items2.length,
      items: items.map((el: any) => preparePost(el))
    };

    return answer;
  },

  async getPostsIdByBlogId2(id: string) {
    const items = await postsCollection
      .find({ 'blogId': id })
      .toArray();

    return items;
  },

  async getPosts() {
    return await postsCollection.find({}).toArray();
  },
};