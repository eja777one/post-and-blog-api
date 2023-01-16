import { emailManager } from '../managers/email-manager';
import { usersRepository } from '../repositories/05.usersDbRepository';
import { usersQueryRepository } from '../repositories/05.usersQueryRepository';
import { ObjectID } from 'bson';
import { UserInputModel } from "../models";
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import add from 'date-fns/add';

export const authServices = {

  async checkAuth(loginOrEmail: string, password: string) {
    const user = await usersQueryRepository.getUser(loginOrEmail);
    if (!user) return false;
    if (!user.emailConfirmation.isConfirmed) return false;
    const inputPass = await this
      ._generateHash(password, user.accountData.passwordSalt);
    const result = inputPass === user.accountData.passwordHash ? user : false;
    return result;
  },

  async confirmEmail(code: string) {
    let user = await usersQueryRepository.getUserByConfirm(code);
    // console.log(user)
    if (!user) return null;
    if (user.emailConfirmation.isConfirmed) return null;
    if (user.emailConfirmation.expirationDate < new Date()) return null;
    let updatedId = await usersRepository.activateUser(user._id);
    return updatedId;
  },

  async createUser(body: UserInputModel, ip: string | undefined) {
    const isUserExist = await usersQueryRepository.getUser(body.email);
    // check user by password
    if (isUserExist) return null;
    // console.log(isUserExist)

    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this
      ._generateHash(body.password, passwordSalt);

    const user = {
      _id: new ObjectID,
      accountData: {
        login: body.login,
        email: body.email,
        passwordHash,
        passwordSalt,
        createdAt: new Date().toISOString(),
      },
      emailConfirmation: {
        confirmationCode: uuidv4(),
        expirationDate: add(new Date(), { hours: 24 }),
        isConfirmed: false,
        sentEmails: []
      },
      registrationDataType: { ip }
    };

    const newUserId = await usersRepository.addUser(user);
    console.log(newUserId)
    try {
      const mail = await emailManager.sendEmailConfirmation(
        user.accountData.email,
        user.emailConfirmation.confirmationCode);
      usersRepository.addConfirmMessage(user._id, mail);
    } catch (error) {
      console.error(error);
      await usersRepository.deleteUserById(user._id.toString());
      return null;
    };
    return newUserId;
  },

  async resendConfirmation(email: string) {
    const user = await usersQueryRepository.getUser(email);
    if (!user) return false;
    if (user.emailConfirmation.isConfirmed) return false;
    if (user.emailConfirmation.expirationDate < new Date()) return false;
    if (user.emailConfirmation.sentEmails.length > 5) return false;

    try {
      const mail = await emailManager.sendEmailConfirmation(
        user.accountData.email,
        user.emailConfirmation.confirmationCode);
      usersRepository.addConfirmMessage(user._id, mail);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    };
  },

  async _generateHash(password: string, salt: string) {
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }
};