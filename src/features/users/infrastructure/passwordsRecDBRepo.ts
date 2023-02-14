import "reflect-metadata";
import { injectable } from 'inversify';
import { ObjectID } from 'bson';
import { PasswordsRecoveryModel } from '../../../db';

@injectable()
export class PasswordRecoveryRepository {

  async save(model: any) {
    const result = await model.save();
    return result._id;
  }

  async getData(code: string) {
    const result = await PasswordsRecoveryModel
      .findOne({ passwordRecoveryCode: code });
    return result;
  }

  async getCode(userId: ObjectID) {
    const result = await PasswordsRecoveryModel.collection.findOne({ userId });
    return result;
  }

  async deletePasswordData(userId: ObjectID) {
    const result = await PasswordsRecoveryModel.deleteOne({ userId });
    return true;
  }

  async deleteAll() {
    const result = await PasswordsRecoveryModel.deleteMany({});
    return true;
  }
};