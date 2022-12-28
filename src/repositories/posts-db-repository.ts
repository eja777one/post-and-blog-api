import { postsCollection } from './db';
import { PostInputModel } from '../models';
import { ObjectID } from 'bson';

export const postsRepository = {
  async createPost(post: any) {
    const result = await postsCollection.insertOne(post);
    return result.insertedId.toString();
  },

  async updatePost(id: string, body: PostInputModel, blogName: string) {
    const result = await postsCollection.updateOne({ _id: new ObjectID(id) },
      {
        $set: {
          title: body.title,
          shortDescription: body.shortDescription,
          content: body.content,
          blogId: body.blogId,
          blogName
        }
      });
    return result.modifiedCount === 1;
  },

  async deletePostById(id: string) {
    const result = await postsCollection.deleteOne({ _id: new ObjectID(id) });
    return result.deletedCount === 1;
  },

  async deleteAll() {
    const result = await postsCollection.deleteMany({});
    return result.deletedCount;
  }
};