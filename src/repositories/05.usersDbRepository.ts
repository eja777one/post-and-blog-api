import { ObjectID } from 'bson';
import MimeNode from 'nodemailer/lib/mime-node';
import { usersCollection } from './00.db';

export const usersRepository = {
  async addUser(user: any) {
    const result = await usersCollection.insertOne(user);
    return result.insertedId.toString();
  },

  async deleteUserById(id: string) {
    const result = await usersCollection.deleteOne({ _id: new ObjectID(id) });
    return result.deletedCount === 1;
  },

  async activateUser(id: ObjectID) {
    const result = await usersCollection.updateOne(
      { _id: id },
      { $set: { 'emailConfirmation.isConfirmed': true } });
    return result.matchedCount;
  },

  async updateConfirmation(id: ObjectID, mail: MimeNode.Envelope, code: string, date: Date) {
    const result = await usersCollection.updateOne(
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

  async addConfirmMessage(id: ObjectID, mail: MimeNode.Envelope) {
    const result = await usersCollection.updateOne(
      { _id: id },
      {
        $push: { 'emailConfirmation.sentEmails': mail }
      });
    return result.matchedCount;
  },

  async deleteAll() {
    const result = await usersCollection.deleteMany({});
    return result.deletedCount;
  }
};