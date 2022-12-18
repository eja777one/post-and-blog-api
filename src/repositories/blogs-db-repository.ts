import { blogsCollection } from './db';
import { BlogInputModel } from "../models";

const randomizer = () => (Math.random() * 10000).toFixed(0);

const options = {
  projection: {
    _id: 0,
    id: 1,
    name: 1,
    description: 1,
    websiteUrl: 1,
    createdAt: 1
  }
};

export const blogRepository = {
  async getBlogs() {
    return await blogsCollection.find({}, options).toArray();
  },

  async createBlog(body: BlogInputModel) {
    const id = `b${randomizer()}`;
    const createdAt = new Date().toISOString();
    const blog = { id, createdAt, ...body };

    const result = await blogsCollection.insertOne(blog);
    return blog;
  },

  async getBlogById(id: string) {
    const blog: any = await blogsCollection.findOne({ id: id }, options); // BAD
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