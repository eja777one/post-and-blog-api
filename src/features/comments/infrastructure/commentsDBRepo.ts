import { ObjectID } from 'bson';
import { injectable } from 'inversify';
import { CommentModel } from '../../../db';

@injectable()
export class CommentsRepository {

  async save(model: any) {
    const result = await model.save();
    return result._id
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