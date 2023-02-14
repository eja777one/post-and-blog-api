import { injectable } from 'inversify';
import { UsersRequestModel } from '../../../db';
import { UsersRequestDBModel } from "../../../models";

@injectable()
export class UsersRequestRepository {

  async addLog(userLog: UsersRequestDBModel) {
    const usersLogs = await UsersRequestModel
      .create({
        _id: userLog._id,
        ip: userLog.ip,
        url: userLog.url,
        createdAt: userLog.createdAt
      })
    return usersLogs;
  }

  async getLogs(userLog: UsersRequestDBModel, attemmptTime: Date) {
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