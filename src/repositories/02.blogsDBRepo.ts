import { BlogModel } from './00.db';
import { BlogInputModel } from "../models";
import { ObjectID } from 'bson';

export class BlogsRepository {

  async createBlog(blog: any) {
    const result = await BlogModel.collection.insertOne(blog);
    return result.insertedId.toString();
  }

  async updateBlog(id: string, body: BlogInputModel) {
    const result = await BlogModel.updateOne(
      { _id: new ObjectID(id) },
      {
        $set: {
          name: body.name,
          description: body.description,
          websiteUrl: body.websiteUrl,
        }
      });

    return result.modifiedCount === 1;
  }

  async deleteBlog(id: string) {
    const result = await BlogModel.deleteOne({ _id: new ObjectID(id) });
    return result.deletedCount === 1;
  }

  async deleteAll() {
    const result = await BlogModel.deleteMany({});
    return result.deletedCount;
  }
};