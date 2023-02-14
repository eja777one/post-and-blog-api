import { UserModel } from './../../../../db';
import { UserDBModel } from '../../../../models';
import mongoose, { HydratedDocument, Model } from "mongoose";
import add from 'date-fns/add';
import { v4 as uuidv4 } from 'uuid';

interface IUserMethods {
  someMethod(): null;
  updateConfirmation(newConfirmationCode: string): void;
  activateUser(): void;
  updatePassword(passwordHash: string, passwordSalt: string): void;
};

export interface IUserDBModel extends Model<UserDBModel, {}, IUserMethods> {
  makeUserByAdmin(login: string, email: string, passwordHash: string,
    passwordSalt: string, ip: string): UserDBModel;
  makeUser(login: string, email: string, passwordHash: string,
    passwordSalt: string, ip: string): UserDBModel;
  someOtherMethod(): Promise<HydratedDocument<UserDBModel, IUserMethods>>
};

export const userSchema = new mongoose.Schema<UserDBModel, IUserMethods>({
  accountData: {
    login: { type: String, required: true },
    email: { type: String, required: true },
    passwordHash: { type: String, required: true },
    passwordSalt: { type: String, required: true },
    createdAt: { type: String, required: true }
  },
  emailConfirmation: {
    confirmationCode: { type: String, required: true },
    expirationDate: { type: Date, required: true },
    isConfirmed: { type: Boolean, required: true },
    sentEmails: [
      { sentDate: { type: Date, required: true } }
    ]
  },
  registrationDataType: {
    ip: { type: String }
  }
});

userSchema.static('makeUserByAdmin', function makeUserByAdmin(login: string,
  email: string, passwordHash: string, passwordSalt: string, ip: string) {
  return new UserModel({
    accountData: {
      login: login,
      email: email,
      passwordHash,
      passwordSalt,
      createdAt: new Date().toISOString(),
    },
    emailConfirmation: {
      confirmationCode: 'none',
      expirationDate: add(new Date(), { hours: 0 }),
      isConfirmed: true,
      sentEmails: []
    },
    registrationDataType: { ip }
  });
});

userSchema.static('makeUser', function makeUser(login: string,
  email: string, passwordHash: string, passwordSalt: string, ip: string) {
  return new UserModel({
    accountData: {
      login: login,
      email: email,
      passwordHash,
      passwordSalt,
      createdAt: new Date().toISOString(),
    },
    emailConfirmation: {
      confirmationCode: uuidv4(),
      expirationDate: add(new Date(), { hours: 24 }),
      isConfirmed: false,
      sentEmails: [{ sentDate: new Date() }]
    },
    registrationDataType: { ip }
  });
});

userSchema.method('updateConfirmation', function updateConfirmation(
  newConfirmationCode: string) {
  this.emailConfirmation.confirmationCode = newConfirmationCode;
  this.emailConfirmation.expirationDate = add(new Date(), { hours: 24 });
  this.emailConfirmation.sentEmails.push({ sentDate: new Date() });
});

userSchema.method('activateUser', function activateUser() {
  this.emailConfirmation.isConfirmed = true;
});

userSchema.method('updatePassword', function updatePassword(
  passwordHash: string, passwordSalt: string) {
  this.accountData.passwordHash = passwordHash;
  this.accountData.passwordSalt = passwordSalt;
});