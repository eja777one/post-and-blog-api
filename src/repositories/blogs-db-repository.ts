import { BlogViewModel } from './../models';
import { blogsCollection } from './db';
import { BlogInputModel } from "../models";

const randomizer = () => (Math.random() * 10000).toFixed(0);

export const blogRepository = {
  async getBlogs() {
    return await blogsCollection.find({}).toArray();
  },

  async createBlog(body: BlogInputModel) {
    const id = `b${randomizer()}`;
    const blog = { id, ...body };

    const result = await blogsCollection.insertOne(blog);
    return blog
  },

  async getBlogById(id: string) {
    const blog: any = await blogsCollection.findOne({ id: id }); // BAD
    return blog;
  },

  async updateBlog(id: string, body: BlogInputModel) {
    const result = await blogsCollection.updateOne({ id: id },
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
    const result = await blogsCollection.deleteOne({ id: id });
    return result.deletedCount === 1;
  },

  async deleteAll() {
    const result = await blogsCollection.deleteMany({});
    const posts = await blogsCollection.find({}).toArray()
    return posts.length === 0;
  }
};