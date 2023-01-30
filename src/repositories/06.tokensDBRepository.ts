import { tokensMetaModel } from './00.db';
import { DeviceViewModel, TokensMetaDBModel } from "../models";

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

    return result.matchedCount === 1;
  },

  async deleteSessionBeforeLogin(
    ip: string,
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

    if (!result) return null;

    let answer: DeviceViewModel[] = [];

    for (let el of result) {
      answer.push({
        ip: el.ip,
        title: el.deviceName,
        lastActiveDate: el.createdAt,
        deviceId: el.deviceId
      });
    };

    return answer;
  },

  async deleteOtherSessions(userId: string, deviceId: string) {
    const result = await tokensMetaModel
      .deleteMany({ userId, deviceId: { $ne: deviceId } });

    return result.deletedCount;
  },

  async deleteThisSessions(userId: string, deviceId: string) {
    const result = await tokensMetaModel
      .deleteOne({ userId, deviceId });

    return result.deletedCount === 1;
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