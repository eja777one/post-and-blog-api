import { ObjectID } from 'bson';
import { commentsCollection } from './db';
export const commentsRepository = {
  async addComment(comment: any) {
    const result = await commentsCollection.insertOne(comment);
    return result.insertedId.toString();
  },
  async updateComment(id: string, comment: any) {
    const result = await commentsCollection.updateOne({ _id: new ObjectID(id) }, {
      $set: {
        content: comment.content,
        userId: comment.userId,
        userLogin: comment.userLogin,
        createdAt: comment.createdAt
      }
    });
    return result.modifiedCount;
  },
  async deleteComment(id: string) {
    const result = await commentsCollection.deleteOne({ _id: new ObjectID(id) })
    return result.deletedCount;
  },
  async deleteAll() {
    const result = await commentsCollection.deleteMany({});
    return result.deletedCount;
  }
};
