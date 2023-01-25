import { usersRequestCollection } from './00.db';
import { usersRequestDBModel } from "../models";

export const usersRequestRepository = {
  async addLog(userLog: usersRequestDBModel) {
    const usersLogs = await usersRequestCollection
      .find({ ip: userLog.ip, url: userLog.url })
      .sort({ 'createdAt': -1 })
      .toArray();

    let result: any;

    if (usersLogs.length < 6) {
      result = await usersRequestCollection.insertOne(userLog);
    } else {
      await usersRequestCollection.deleteOne({
        ip: userLog.ip,
        createdAt: usersLogs[4].createdAt
      });
      result = await usersRequestCollection.insertOne(userLog);
    }
    return result.insertedId;
  },

  async getLogs(userLog: usersRequestDBModel) {
    const result = await usersRequestCollection
      .find({ ip: userLog.ip, url: userLog.url })
      .sort({ 'createdAt': -1 })
      .toArray();

    return result;
  },

  async deleteLogs(userLog: usersRequestDBModel) {
    const result = await usersRequestCollection
      .deleteMany({ ip: userLog.ip, url: userLog.url })

    return result;
  },

  async deleteAll() {
    const result = await usersRequestCollection.deleteMany({});

    return result.deletedCount;
  }
};