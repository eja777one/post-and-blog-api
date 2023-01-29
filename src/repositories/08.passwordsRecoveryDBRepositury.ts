import { ObjectID } from 'bson';
import { PasswordsRecoveryModel } from './00.db';

export const passwordRecoveryRepository = {
  async addData(passwordData: any) {
    const result = await PasswordsRecoveryModel
      .collection.insertOne(passwordData);
    return true;
  },

  async getData(code: string) {
    const result = await PasswordsRecoveryModel.collection
      .findOne({ passwordRecoveryCode: code });
    return result;
  },

  async getCode(userId: ObjectID) {
    const result = await PasswordsRecoveryModel.
      collection.findOne({ userId });
    return result;
  },

  async deletePasswordData(userId: ObjectID) {
    const result = await PasswordsRecoveryModel
      .deleteOne({ userId });
    return true;
  },

  async deleteAll() {
    const result = await PasswordsRecoveryModel.deleteMany({});
    return true;
  }
};

