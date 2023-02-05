import { ObjectID } from 'bson';
import { CommentDBModel, LikesInfoViewModel } from '../models';
import { CommentModel } from './00.db';

export class CommentsRepository {

  async addComment(comment: CommentDBModel) {
    const result = await CommentModel.collection.insertOne(comment);
    return result.insertedId.toString();
  }

  async updateComment(id: string, content: string) {
    const result = await CommentModel.updateOne({ _id: new ObjectID(id) },
      { $set: { content } });

    return result.matchedCount === 1;
  }

  async updateLikeStatus(id: string, likesData: LikesInfoViewModel) {
    const result = await CommentModel.updateOne({ _id: new ObjectID(id) },
      {
        $set: {
          likesCount: likesData.likesCount,
          dislikesCount: likesData.dislikesCount,
          myStatus: likesData.myStatus
        }
      });
    return result.modifiedCount === 1;
  }

  async deleteComment(id: string) {
    const result = await CommentModel.deleteOne({ _id: new ObjectID(id) });
    return result.deletedCount === 1;
  }

  async deleteAll() {
    const result = await CommentModel.deleteMany({});
    return result.deletedCount;
  }
};