import { ObjectID } from 'bson';
import { CommentModel } from './00.db';

export const commentsRepository = {

  async addComment(comment: any) {
    const result = await CommentModel
      .collection.insertOne(comment);

    return result.insertedId.toString();
  },

  async updateComment(id: string, comment: any) {
    const result = await CommentModel.updateOne(
      { _id: new ObjectID(id) },
      {
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
    const result = await CommentModel
      .deleteOne({ _id: new ObjectID(id) });

    return result.deletedCount;
  },

  async deleteAll() {
    const result = await CommentModel.deleteMany({});

    return result.deletedCount;
  }
};
