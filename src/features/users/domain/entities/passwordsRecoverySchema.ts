import { ObjectID } from 'bson';
import { HydratedDocument, Model, Schema } from "mongoose";
import { PasswordsRecoveryModel } from '../../../../db';
import { PasswordDataDBModel } from '../../../../models';
import { v4 as uuidv4 } from 'uuid';
import add from 'date-fns/add';

interface IPasswordMethods {
  // someMethod(): null;
}

export interface IPasswordDataDBModel
  extends Model<PasswordDataDBModel, {}, IPasswordMethods> {

  makePasswordData(userId: ObjectID): PasswordDataDBModel;
  // someOtherMethod(): 
  // Promise<HydratedDocument<PasswordDataDBModel, IPasswordDataDBModel>>
};

export const passwordsRecoverySchema =
  new Schema<PasswordDataDBModel, IPasswordDataDBModel>({
    userId: { type: ObjectID, required: true },
    passwordRecoveryCode: { type: String, required: true },
    createdAt: { type: String, required: true },
    expiredAt: { type: String, required: true },
  });

passwordsRecoverySchema.static('makePasswordData', function makePasswordData
  (userId: ObjectID) {
  return new PasswordsRecoveryModel({
    userId: userId,
    passwordRecoveryCode: uuidv4(),
    createdAt: new Date().toISOString(),
    expiredAt: add(new Date(), { minutes: 10 }).toISOString(),
  });
});