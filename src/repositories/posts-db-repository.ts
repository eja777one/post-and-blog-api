import { postsCollection } from './db';
import { blogRepository } from './blogs-db-repository';
import { PostInputModel } from '../models';

const randomizer = () => (Math.random() * 10000).toFixed(0);

export const postsRepository = {
  async getPosts() {
    return await postsCollection.find({}).toArray();
  },

  async createPost(body: PostInputModel) {
    const blogName = await blogRepository.getBlogById(body.blogId).then(value => value.name);

    const id = `p${randomizer()}`;
    const post = { id, blogName, ...body };

    const result = await postsCollection.insertOne(post);

    return post;
  },

  async getPostById(id: string) {
    const post = await postsCollection.findOne({ id: id });
    return post;
  },

  async updatePost(id: string, body: PostInputModel) {
    const result = await postsCollection.updateOne({ id: id },
      {
        $set: {
          title: body.title,
          shortDescription: body.shortDescription,
          content: body.content,
          blogId: body.blogId
        }
      });

    return result.matchedCount === 1;
  },

  async deletePostById(id: string) {
    const result = await postsCollection.deleteOne({ id: id });
    return result.deletedCount === 1;
  },

  async deleteAll() {
    const result = await postsCollection.deleteMany({});
    const posts = await postsCollection.find({}).toArray()
    return posts.length === 0;
  }
}