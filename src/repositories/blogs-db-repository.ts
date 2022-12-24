import { blogsCollection } from './db';
import { BlogInputModel } from "../models";
import { ObjectID } from 'bson';

export const blogRepository = {
  async getBlogsByQuery(query: any) {
    const skip = (query.pageNumber - 1) * query.pageSize;
    const limit = query.pageSize;
    const sortBy = query.sortBy;
    const sortDirection = query.sortDirection = 'asc' ? 1 : -1;
    const sortObj: any = {};
    sortObj[sortBy] = sortDirection
    const findObj = query.searchNameTerm ? { name: new RegExp(query.searchNameTerm, 'i') } : {};

    const items = await blogsCollection.find(findObj)
      .sort(sortObj)
      .limit(limit)
      .skip(skip)
      .toArray();

    const allItems = (await this.getBlogs()).length

    const pagesCount = Math.ceil(allItems / limit);

    const answer = {
      pagesCount,
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: items.length,
      items
    }

    return answer;
  },

  async createBlog(blog: any) {
    const result = await blogsCollection.insertOne(blog);
    return this.getBlogById(result.insertedId.toString());
  },

  async getBlogById(id: string) {
    const blog = await blogsCollection.findOne({ _id: new ObjectID(id) });
    return blog;
  },

  async updateBlog(id: string, body: BlogInputModel) {
    const result = await blogsCollection.updateOne({ _id: new ObjectID(id) },
      {
        $set: {
          name: body.name,
          description: body.description,
          websiteUrl: body.websiteUrl,
        }
      });

    return result.matchedCount === 1;
  },

  async deleteBlogById(id: string) {
    const result = await blogsCollection.deleteOne({ _id: new ObjectID(id) });
    return result.deletedCount === 1;
  },

  async getBlogs() {
    const blogs = await blogsCollection.find({}).toArray();
    return blogs;
  },

  async deleteAll() {
    const result = await blogsCollection.deleteMany({});
    return result.deletedCount;
  }
};