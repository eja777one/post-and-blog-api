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
<<<<<<< HEAD
        url: userLog.url,
        createdAt: userLog.createdAt
      })
    return usersLogs
  },

  async getLogs(userLog: usersRequestDBModel) {
    const isoDate = userLog.createdAt.toISOString();
    console.log(userLog.createdAt, 'isoDate')
    // const result = await UsersRequestModel.countDocuments({
    //   ip: { $regex: userLog.ip },
    //   url: { $regex: userLog.url },
    //   // createdAt: { $gt: isoDate }
    //   // createdAt: { $gt: userLog.createdAt }
    // })
    const result = await UsersRequestModel.find({
      ip: { $regex: userLog.ip },
      url: { $regex: userLog.url },
      // createdAt: { $gt: isoDate }
      // createdAt: { $gt: userLog.createdAt }
    })

    // console.log(result)
    console.log(result)

    const len = result.filter(el => el.createdAt > userLog.createdAt).length
    console.log(len)

    return result;
  },

  async getData() {
    const result = await UsersRequestModel.find({}).lean()
    return result;
=======
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
>>>>>>> parent of 1308791 (fix 429 response)
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