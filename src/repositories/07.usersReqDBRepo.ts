import { UsersRequestModel } from './00.db';
import { usersRequestDBModel } from "../models";

class UsersRequestRepository {

  async addLog(userLog: usersRequestDBModel) {
    const usersLogs = await UsersRequestModel
      .create({
        _id: userLog._id,
        ip: userLog.ip,
        url: userLog.url,
        createdAt: userLog.createdAt
      })
    return usersLogs;
  }

  async getLogs(userLog: usersRequestDBModel, attemmptTime: Date) {
    const isoDate = attemmptTime.toISOString();

    const result = await UsersRequestModel.countDocuments({
      ip: { $regex: userLog.ip },
      url: { $regex: userLog.url },
      createdAt: { $gt: isoDate }
    });

    return result;
  }

  async deleteAll() {
    const result = await UsersRequestModel.deleteMany({});
    return result.deletedCount;
  }
};

export const usersRequestRepository = new UsersRequestRepository();