import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import { settings } from './settings';

export const jwtService = {

  async createAccessJwt(userId: string) {
    return jwt.sign(
      { userId },
      settings.ACCESS_JWT_SECRET,
      { expiresIn: '30m' }
    );
  },

  async createRefreshJwt(
    userId: string,
    deviceId: string,
    createdAt: string) {

    return jwt.sign(
      { userId, deviceId, createdAt },
      settings.REFRESH_JWT_SECRET,
      { expiresIn: '60m' }
    );
  },

  async getUserIdByToken(token: string) {
    try {
      const result: any = jwt.
        verify(token, settings.ACCESS_JWT_SECRET);

      return new ObjectId(result.userId);
    } catch (error) { return null };
  },

  async getPayloadRefToken(token: string) {
    try {
      const result: any = jwt.verify(token, settings.REFRESH_JWT_SECRET);

      return {
        userId: result.userId,
        deviceId: result.deviceId,
        createdAt: result.createdAt
      };

    } catch (error) { return null };
  },

  async getExpiredPayloadRefToken(token: string) {
    try {
      const result: any = jwt.verify(
        token,
        settings.REFRESH_JWT_SECRET,
        { ignoreExpiration: true }
      );

      return {
        userId: result.userId,
        deviceId: result.deviceId,
        createdAt: result.createdAt
      };
    } catch (error) { return null };
  },
};