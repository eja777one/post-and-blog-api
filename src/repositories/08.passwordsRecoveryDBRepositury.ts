import { PasswordsRecoveryModel } from './00.db';

export const passwordRecoveryRepository = {
  async addCode(code: string) {
    const result = await PasswordsRecoveryModel.collection.insertOne({ code });
    return true;
  },

  async getCode() {
    const result = await PasswordsRecoveryModel.find({});
    return result[0];
  },

  async deleteCode(code: string) {
    const result = await PasswordsRecoveryModel.deleteOne({ code });
    return result.deletedCount === 1;
  },

  async deleteAll() {
    const result = await PasswordsRecoveryModel.deleteMany({});
    return true;
  }
};

