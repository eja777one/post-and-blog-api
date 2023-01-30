import { UsersRequestModel } from './00.db';
import { usersRequestDBModel } from "../models";

export const usersRequestRepository = {

  async addLog(userLog: usersRequestDBModel) {
    const usersLogs = await UsersRequestModel
      .create({
        _id: userLog._id,
        ip: userLog.ip,
        url: userLog.url,
        createdAt: userLog.createdAt
      })
    return usersLogs
  },

  async getLogs(userLog: usersRequestDBModel, attemmptTime: Date) {
    // const isoDate = userLog.createdAt.toISOString();
    const isoDate = attemmptTime.toISOString();
    console.log(userLog.createdAt, 'isoDate')

    const result = await UsersRequestModel.countDocuments({
      ip: { $regex: userLog.ip },
      url: { $regex: userLog.url },
      createdAt: { $gt: isoDate }
      // createdAt: { $gt: userLog.createdAt }
    })

    // const result = await UsersRequestModel.find({
    //   ip: { $regex: userLog.ip },
    //   url: { $regex: userLog.url },
    //   // createdAt: { $gt: isoDate }
    //   // createdAt: { $gt: userLog.createdAt }
    // });

    // const len = result.filter(el => el.createdAt.getTime() < userLog.createdAt.getTime());

    // console.log(len.length)
    console.log(result)

    return result;
  },

  async getData() {
    const result = await UsersRequestModel.find({}).lean()
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