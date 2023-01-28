import { UsersRequestModel } from './00.db';
import { usersRequestDBModel } from "../models";

export const usersRequestRepository = {

  async addLog(userLog: usersRequestDBModel) {
    const usersLogs = await UsersRequestModel
      .find({ ip: userLog.ip, url: userLog.url })
      .sort({ 'createdAt': -1 })
      .lean();

    let result: any;

    if (usersLogs.length < 6) {
      result = await UsersRequestModel.collection.insertOne(userLog);
    } else {
      await UsersRequestModel.deleteOne({
        ip: userLog.ip,
        createdAt: usersLogs[4].createdAt
      });
      result = await UsersRequestModel.collection.insertOne(userLog);
    }
    return result.insertedId;
  },

  async getLogs(userLog: usersRequestDBModel) {
    const result = await UsersRequestModel
      .find({ ip: userLog.ip, url: userLog.url })
      .sort({ 'createdAt': -1 })
      .lean();

    return result;
  },

  async deleteLogs(userLog: usersRequestDBModel) {
    const result = await UsersRequestModel
      .deleteMany({ ip: userLog.ip, url: userLog.url })

    return result;
  },

  async deleteAll() {
    const result = await UsersRequestModel.deleteMany({});

    return result.deletedCount;
  }
};