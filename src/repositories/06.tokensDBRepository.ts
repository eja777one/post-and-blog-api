import { tokensMetaCollection } from './00.db';
import { DeviceViewModel, TokensMetaDBModel } from "../models";

export const tokensMetaRepository = {
  async addSession(sessionData: TokensMetaDBModel) {

    const result = await tokensMetaCollection
      .insertOne(sessionData);

    return result.insertedId.toString();
  },

  async updateSession(previousCreatedAt: string, createdAt: string, expiredAt: string) {

    const result = await tokensMetaCollection.updateOne(
      { createdAt: previousCreatedAt },
      { $set: { createdAt, expiredAt } }
    );

    return result.matchedCount
  },

  async deleteSessionBeforeLogin(
    ip: string | string[] | null,
    deviceName: string,
    userId: string) {

    const result = await tokensMetaCollection
      .deleteOne({ userId, ip, deviceName });

    return result.deletedCount;
  },

  async deleteSessionBeforeLogout(
    userId: string,
    deviceId: string
  ) {
    const result = await tokensMetaCollection
      .deleteOne({ userId, deviceId });

    return result.deletedCount;
  },

  async getUsersSessions(userId: string) {
    const result = await tokensMetaCollection
      .find({ userId }).toArray();

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
    const result = await tokensMetaCollection
      .deleteMany({ userId, deviceId: { $ne: deviceId } });

    return result.deletedCount;
  },

  async deleteThisSessions(userId: string, deviceId: string) {
    const result = await tokensMetaCollection
      .deleteOne({ userId, deviceId });

    return result.deletedCount;
  },

  async getSessionByDeviceId(deviceId: string) {
    const result = await tokensMetaCollection
      .findOne({ deviceId });

    return result;
  },

  async deleteAll() {
    const result = await tokensMetaCollection
      .deleteMany({});

    return result.deletedCount;
  }
};