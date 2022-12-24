import { postsCollection } from './db';
import { PostInputModel } from '../models';
import { ObjectID } from 'bson';

const opt = {
  projection: {
    _id: 0,
    id: 1,
    title: 1,
    shortDescription: 1,
    content: 1,
    blogId: 1,
    blogName: 1,
    createdAt: 1,
  }
};

export const postsRepository = {
  async getPostsByBlogId(id: string, query: any) {

    const skip = (query.pageNumber - 1) * query.pageSize;
    const limit = query.pageSize;
    const sortBy = query.sortBy;
    const sortDirection = query.sortDirection = 'asc' ? 1 : -1;
    const sortObj: any = {};
    sortObj[sortBy] = sortDirection
    const findObj = { 'blogId': id };

    const items = await postsCollection.find(findObj, query)
      .sort(sortObj)
      .limit(limit)
      .skip(skip)
      .toArray();

    const pagesCount = Math.ceil(items.length / limit);

    const answer = {
      pagesCount,
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: items.length,
      items
    };

    return answer;
  },

  async getPostsByQuery(query: any) {
    const skip = (query.pageNumber - 1) * query.pageSize;
    const limit = query.pageSize;
    const sortBy = query.sortBy;
    const sortDirection = query.sortDirection = 'asc' ? 1 : -1;
    const sortObj: any = {};
    sortObj[sortBy] = sortDirection

    const items = await postsCollection.find({})
      .sort(sortObj)
      .limit(limit)
      .skip(skip)
      .toArray();

    const pagesCount = Math.ceil(items.length / limit);

    const answer = {
      pagesCount,
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: items.length,
      items
    }

    return answer;
  },

  async getPosts() {
    const items = await postsCollection.find({}).toArray()
    return items;
  },

  async createPost(post: any) {
    const result = await postsCollection.insertOne(post);
    return this.getPostById(result.insertedId.toString());
  },

  async getPostById(id: string) {
    // const post = await postsCollection.findOne({ id: id }, opt);
    const post = await postsCollection.findOne({ _id: new ObjectID(id) });
    return post;
  },

  async updatePost(id: string, body: PostInputModel, blogName: string) {
    const result = await postsCollection.updateOne({ id: id },
      {
        $set: {
          title: body.title,
          shortDescription: body.shortDescription,
          content: body.content,
          blogId: body.blogId,
          blogName
        }
      });

    return result.matchedCount === 1;
  },

  async deletePostById(id: string) {
    const result = await postsCollection.deleteOne({ _id: new ObjectID(id) });
    return result.deletedCount === 1;
  },

  async deleteAll() {
    const result = await postsCollection.deleteMany({});
    const posts = await postsCollection.find({}).toArray();
    return posts.length === 0;
  }
};