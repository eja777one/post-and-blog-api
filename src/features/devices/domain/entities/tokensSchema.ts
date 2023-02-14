import { tokensMetaModel } from './../../../../db';
import { TokensMetaDBModel } from '../../../../models';
import { HydratedDocument, Model, Schema } from "mongoose";
import add from 'date-fns/add';

interface ITokensMetaMethods {
  // someMethod(): null;
  updateSession(createdAt: string): void;
}

export interface ITokensMetaDBModel
  extends Model<TokensMetaDBModel, {}, ITokensMetaMethods> {
  makeSession(createdAt: string, deviceId: string, ip: string,
    deviceName: string, userId: string): TokensMetaDBModel;
  // someOtherMethod()
  //   : Promise<HydratedDocument<TokensMetaDBModel, ITokensMetaMethods>>
};

export const tokensMetaSchema = new
  Schema<TokensMetaDBModel, ITokensMetaDBModel>({
    createdAt: { type: String, required: true },
    expiredAt: { type: String, required: true },
    deviceId: { type: String, required: true },
    ip: { type: String, required: true },
    deviceName: { type: String, required: true },
    userId: { type: String, required: true }
  });

tokensMetaSchema.static('makeSession', function makeSession(createdAt: string,
  deviceId: string, ip: string, deviceName: string, userId: string) {
  return new tokensMetaModel({
    createdAt: createdAt,
    expiredAt: add(new Date(), { minutes: 60 }).toISOString(),
    deviceId: deviceId,
    ip: ip,
    deviceName: deviceName,
    userId: userId
  });
});

tokensMetaSchema.method('updateSession', function updateSession(
  createdAt: string) {
  this.createdAt = createdAt;
  this.expiredAt = add(new Date(), { minutes: 60 }).toISOString();
});