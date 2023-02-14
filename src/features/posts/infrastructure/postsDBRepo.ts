import { PostModel } from '../../../db';
import { ObjectID } from 'bson';
import { injectable } from 'inversify';

@injectable()
export class PostsRepository {

  async save(model: any) {
    const result = await model.save();
    return result._id;
  }

  async updatePostsBlogName(id: string, blogName: string) {
    const result = await PostModel.updateOne({ _id: new ObjectID(id) },
      { $set: { blogName } });
    return result.matchedCount === 1;
  }

  async deletePost(id: string) {
    const result = await PostModel.deleteOne({ _id: new ObjectID(id) });
    return result.deletedCount === 1;
  }

  async deleteAll() {
    const result = await PostModel.deleteMany({});
    return result.deletedCount;
  }
};