import { tokensMetaModel } from './00.db';
import { TokensMetaDBModel } from "../models";

export const tokensMetaRepository = {

  async addSession(sessionData: TokensMetaDBModel) {
    const result = await tokensMetaModel
      .collection.insertOne(sessionData);

    return result.insertedId.toString();
  },

  async updateSession(previousCreatedAt: string, createdAt: string, expiredAt: string) {
    const result = await tokensMetaModel.updateOne(
      { createdAt: previousCreatedAt },
      { $set: { createdAt, expiredAt } }
    );

    return result.matchedCount
  },

  async deleteSessionBeforeLogin(
    ip: string | string[] | null,
    deviceName: string,
    userId: string) {
    const result = await tokensMetaModel
      .deleteOne({ userId, ip, deviceName });

    return result.deletedCount;
  },

  async deleteSessionBeforeLogout(
    userId: string,
    deviceId: string
  ) {
    const result = await tokensMetaModel
      .deleteOne({ userId, deviceId });

    return result.deletedCount;
  },

  async getUsersSessions(userId: string) {
    const result = await tokensMetaModel
      .find({ userId }).lean();

    let answer: any = [];

    if (result) {
      result.map(session => {
        answer.push({
          ip: session.ip,
          title: session.deviceName,
          lastActiveDate: session.createdAt,
          deviceId: session.deviceId
        });
      });
      return answer;
    } else return null;
  },

  async deleteOtherSessions(userId: string, deviceId: string) {
    const result = await tokensMetaModel
      .deleteMany({ userId, deviceId: { $ne: deviceId } });

    return result.deletedCount;
  },

  async deleteThisSessions(userId: string, deviceId: string) {
    const result = await tokensMetaModel
      .deleteOne({ userId, deviceId });

    return result.deletedCount;
  },

  async getSessionByDeviceId(deviceId: string) {
    const result = await tokensMetaModel
      .findOne({ deviceId });

    return result;
  },

  async deleteAll() {
    const result = await tokensMetaModel
      .deleteMany({});

    return result.deletedCount;
  }
};