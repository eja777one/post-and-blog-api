import { blogsCollection } from './db';
import { BlogInputModel } from "../models";
import { ObjectID } from 'bson';

export const blogRepository = {
  async createBlog(blog: any) {
    const result = await blogsCollection.insertOne(blog);
    return result.insertedId.toString();
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

    return result.matchedCount;
  },

  async deleteBlogById(id: string) {
    const result = await blogsCollection.deleteOne({ _id: new ObjectID(id) });
    return result.deletedCount;
  },

  async deleteAll() {
    const result = await blogsCollection.deleteMany({});
    return result.deletedCount;
  }
};