import { UserDBModel } from './../models';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import { settings } from './settings';

export const jwtService = {
  async createJwt(user: UserDBModel) {
    const token = jwt.sign({ userId: user._id }, settings.JWT_SECRET, { expiresIn: '100h' });
    return { token };
  },
  async getUserIdByToken(token: string) {
    try {
      const result: any = jwt.verify(token, settings.JWT_SECRET);
      return new ObjectId(result.userId);
    } catch (error) {
      return null;
    };
  }
};