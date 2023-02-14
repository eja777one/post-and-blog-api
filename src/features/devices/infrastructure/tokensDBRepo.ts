import { injectable } from 'inversify';
import { tokensMetaModel } from '../../../db';

@injectable()
export class TokensMetaRepository {

  async save(model: any) {
    const result = model.save();
    return result._id;
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