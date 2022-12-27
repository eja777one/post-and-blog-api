import { ObjectID } from 'bson';
import { usersCollection } from './db';

export const usersRepository = {
  async addUser(user: any) {
    const result = await usersCollection.insertOne(user);
    return result.insertedId.toString();
  },

  async deleteUserById(id: string) {
    const result = await usersCollection.deleteOne({ _id: new ObjectID(id) });
    return result.deletedCount === 1;
  },

  async deleteAll() {
    const result = await usersCollection.deleteMany({});
    return result.deletedCount;
  }
};