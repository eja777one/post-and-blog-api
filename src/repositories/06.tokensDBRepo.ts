import { tokensMetaModel } from './00.db';
import { TokensMetaDBModel } from "../models";

class TokensMetaRepository {

  async addSession(sessionData: TokensMetaDBModel) {
    const result = await tokensMetaModel.collection.insertOne(sessionData);
    return result.insertedId.toString();
  }

  async updateSession(previousCreatedAt: string, createdAt: string,
    expiredAt: string) {
    const result = await tokensMetaModel.updateOne(
      { createdAt: previousCreatedAt },
      { $set: { createdAt, expiredAt } }
    );

    return result.matchedCount === 1;
  }

  async deleteSessionBeforeLogin(ip: string, deviceName: string,
    userId: string) {
    const result = await tokensMetaModel.deleteOne({ userId, ip, deviceName });
    return result.deletedCount;
  }

  async deleteSessionBeforeLogout(userId: string, deviceId: string) {
    const result = await tokensMetaModel.deleteOne({ userId, deviceId });
    return result.deletedCount === 1;
  }

  async deleteOtherSessions(userId: string, deviceId: string) {
    const result = await tokensMetaModel
      .deleteMany({ userId, deviceId: { $ne: deviceId } });

    return result.deletedCount >= 0;
  }

  async deleteThisSessions(userId: string, deviceId: string) {
    const result = await tokensMetaModel.deleteOne({ userId, deviceId });
    return result.deletedCount === 1;
  }

  async deleteAll() {
    const result = await tokensMetaModel.deleteMany({});
    return result.deletedCount;
  }
};

export const tokensMetaRepository = new TokensMetaRepository();