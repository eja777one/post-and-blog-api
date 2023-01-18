import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import { settings } from './settings';

export const jwtService = {
  async createAccessJwt(userId: string) {
    const token = jwt.sign({ userId }, settings.ACCESS_JWT_SECRET, { expiresIn: '10s' });
    return token;
  },
  async createRefreshJwt(userId: string) {
    const token = jwt.sign({ userId }, settings.REFRESH_JWT_SECRET, { expiresIn: '20s' });
    return token;
  },
  async getUserIdByToken(token: string) {
    try {
      const result: any = jwt.verify(token, settings.ACCESS_JWT_SECRET);
      return new ObjectId(result.userId);
    } catch (error) {
      return null;
    };
  },
  async getUserIdByRefreshToken(token: string) {
    try {
      const result: any = jwt.verify(token, settings.REFRESH_JWT_SECRET);
      return new ObjectId(result.userId);
    } catch (error) {
      return null;
    };
  },
};