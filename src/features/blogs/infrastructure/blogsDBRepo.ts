import { BlogModel } from '../../../db';
import { ObjectID } from 'bson';
import { injectable } from 'inversify';

@injectable()
export class BlogsRepository {

  async save(model: any) {
    const result = await model.save();
    return result._id;
  }

  async deleteBlog(id: string) {
    const result = await BlogModel.deleteOne({ _id: new ObjectID(id) });
    return result.deletedCount === 1;
  }

  async deleteAll() {
    const result = await BlogModel.deleteMany({});
    return result.deletedCount;
  }
};