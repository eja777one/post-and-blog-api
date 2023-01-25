import { tokensMetaCollection } from "./00.db";

export const tokensQueryMetaRepository = {

  async getTokenMeta(userId: string, deviceId: string) {
    const result = await tokensMetaCollection
      .findOne({ userId, deviceId });

    return result?.createdAt;
  },

  async checkSession(
    ip: string | string[] | null,
    deviceName: string,
    userId: string) {

    const result = await tokensMetaCollection
      .findOne({ userId, ip, deviceName });

    return result;
  }

};