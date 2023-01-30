import { PostModel } from './00.db';
import { PostInputModel } from '../models';
import { ObjectID } from 'bson';

export const postsRepository = {

  async createPost(post: any) {
    const result = await PostModel.collection.insertOne(post);
    return result.insertedId.toString();
  },

  async updatePost(id: string, body: PostInputModel, blogName: string) {
    const result = await PostModel.updateOne({ _id: new ObjectID(id) },
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

  async updatePostsBlogName(id: string, blogName: string) {
    const result = await PostModel.updateOne(
      { _id: new ObjectID(id) },
      { $set: { blogName } }
    );
    return result.matchedCount === 1;
  },

  async deletePostById(id: string) {
    const result = await PostModel
      .deleteOne({ _id: new ObjectID(id) });

    return result.deletedCount === 1;
  },

  async deleteAll() {
    const result = await PostModel.deleteMany({});
    return result.deletedCount;
  }
};