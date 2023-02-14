import { injectable } from 'inversify';
import { DeviceViewModel } from "../../../models";
import { tokensMetaModel } from "../../../db";

@injectable()
export class TokensQueryMetaRepository {

  async getSessionByDeviceId(deviceId: string) {
    const result = await tokensMetaModel.findOne({ deviceId });
    return result;
  }

  async getUsersSessions(userId: string) {
    const result = await tokensMetaModel.find({ userId }).lean();
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
  }

  async getTokenMeta(userId: string, deviceId: string) {
    const result = await tokensMetaModel.findOne({ userId, deviceId });
    return result;
  }

  async checkSession(ip: string, deviceName: string, userId: string) {
    const result = await tokensMetaModel.findOne({ userId, ip, deviceName });
    return result;
  }
};