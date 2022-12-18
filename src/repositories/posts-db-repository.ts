import { postsCollection } from './db';
import { blogRepository } from './blogs-db-repository';
import { PostInputModel } from '../models';

const randomizer = () => (Math.random() * 10000).toFixed(0);

const options = {
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

  async getPosts() {
    return await postsCollection.find({}, options).toArray();
  },

  async createPost(body: PostInputModel) {
    const blogName = await blogRepository.getBlogById(body.blogId).then(value => value.name);

    const id = `p${randomizer()}`;
    const createdAt = new Date().toISOString();

    const post = { id, blogName, createdAt, ...body };

    const result = await postsCollection.insertOne(post);

    return this.getPostById(post.id);
  },

  async getPostById(id: string) {
    const post = await postsCollection.findOne({ id: id }, options);
    return post;
  },

  async updatePost(id: string, body: PostInputModel) {
    const blogName = await blogRepository.getBlogById(body.blogId).then(value => value.name);

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
    const result = await postsCollection.deleteOne({ id: id });
    return result.deletedCount === 1;
  },

  async deleteAll() {
    const result = await postsCollection.deleteMany({});
    const posts = await postsCollection.find({}).toArray();
    return posts.length === 0;
  }
}