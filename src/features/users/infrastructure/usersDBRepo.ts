import { ObjectID } from 'bson';
import { injectable } from 'inversify';
import { UserModel } from '../../../db';

@injectable()
export class UsersRepository {
  async save(model: any) {
    const result = await model.save();
    return result._id;
  }

  async deleteUser(id: string) {
    const result = await UserModel.deleteOne({ _id: new ObjectID(id) });
    return result.deletedCount === 1;
  }

  async deleteAll() {
    const result = await UserModel.deleteMany({});
    return result.deletedCount;
  }
};