import { ObjectID } from 'bson';
import MimeNode from 'nodemailer/lib/mime-node';
import { UserDBModel } from '../models';
import { UserModel } from './00.db';

export const usersRepository = {
  async addUser(user: UserDBModel) {
    const result = await UserModel
      .collection.insertOne(user);

    return result.insertedId.toString();
  },

  async deleteUserById(id: string) {
    const result = await UserModel
      .deleteOne({ _id: new ObjectID(id) });

    return result.deletedCount === 1;
  },

  async activateUser(id: ObjectID) {
    const result = await UserModel.updateOne(
      { _id: id },
      { $set: { 'emailConfirmation.isConfirmed': true } });

    return result.matchedCount;
  },

  async updateConfirmation(id: ObjectID, mail: MimeNode.Envelope, code: string, date: Date) {
    const result = await UserModel.updateOne(
      { _id: id },
      {
        $push: { 'emailConfirmation.sentEmails': mail },
        $set: {
          'emailConfirmation.confirmationCode': code,
          'emailConfirmation.expirationDate': date,
        }
      });

    return result.matchedCount;
  },

  async updatePassword(_id: ObjectID, passwordHash: string, passwordSalt: string) {
    const result = await UserModel.updateOne(
      { _id },
      {
        $set: {
          'accountData.passwordHash': passwordHash,
          'accountData.passwordSalt': passwordSalt,
        }
      });

    return result.matchedCount === 1;
  },

  async addConfirmMessage(id: ObjectID, mail: MimeNode.Envelope) {
    const result = await UserModel.updateOne(
      { _id: id },
      {
        $push: { 'emailConfirmation.sentEmails': mail }
      });

    return result.matchedCount;
  },

  async deleteAll() {
    const result = await UserModel.deleteMany({});

    return result.deletedCount;
  }
};