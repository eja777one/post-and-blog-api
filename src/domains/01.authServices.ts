import { emailManager } from '../managers/email-manager';
import { usersRepository } from '../repositories/05.usersDbRepository';
import { usersQueryRepository } from '../repositories/05.usersQueryRepository';
import { ObjectID } from 'bson';
import { UserInputModel } from "../models";
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import add from 'date-fns/add';
import { jwtService } from '../application/jwt-service';

export const authServices = {
  async checkAuth(loginOrEmail: string, password: string) {
    const user = await usersQueryRepository.getUser(loginOrEmail);

    if (!user) return null;
    if (!user.emailConfirmation.isConfirmed) return null;

    const inputPass = await this
      ._generateHash(password, user.accountData.passwordSalt);

    if (inputPass !== user.accountData.passwordHash) return null;

    const accessToken = await jwtService.createAccessJwt(user._id.toString());
    const refreshToken = await jwtService.createRefreshJwt(user._id.toString());

    await usersRepository.updateRefreshToken(user._id, refreshToken);

    return { accessToken, refreshToken };
  },

  async getNewTokensPair(refreshToken: string) {
    const userId = await jwtService.getUserIdByRefreshToken(refreshToken);
    if (!userId) return null;

    const user = await usersQueryRepository.getDbUserById(userId.toString());
    if (user?.loginData.refreshToken !== refreshToken) return null;

    const newAccessToken = await jwtService.createAccessJwt(userId.toString());
    const newRefreshToken = await jwtService.createRefreshJwt(userId.toString());

    const result = await usersRepository.updateRefreshToken(userId, newRefreshToken);
    if (result !== 1) return null;

    return { newAccessToken, newRefreshToken };
  },

  async deleteRefreshToken(refreshToken: string) {
    const userId = await jwtService.getUserIdByRefreshToken(refreshToken);
    if (!userId) return false;

    const user = await usersQueryRepository.getDbUserById(userId.toString());
    if (user?.loginData.refreshToken !== refreshToken) return false;

    const result = await usersRepository.updateRefreshToken(userId, 'No Refresh Token');
    if (result !== 1) return false;

    return true;
  },

  async confirmEmail(code: string) {
    let user = await usersQueryRepository.getUserByConfirm(code);
    if (!user) return null;
    if (user.emailConfirmation.isConfirmed) return null;
    if (user.emailConfirmation.expirationDate < new Date()) return null;
    let updatedId = await usersRepository.activateUser(user._id);
    return updatedId;
  },

  async createUser(body: UserInputModel, ip: string | undefined) {
    const isEmailExist = await usersQueryRepository.getUser(body.email);
    const isLoginExist = await usersQueryRepository.getUser(body.login);

    const errorEmail = { errorsMessages: [{ message: 'incorrect email', field: 'email' }] };
    const errorLogin = { errorsMessages: [{ message: 'incorrect login', field: 'login' }] };

    if (isEmailExist) return errorEmail;
    if (isLoginExist) return errorLogin;

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

    try {
      const mail = await emailManager.sendEmailConfirmation(
        user.accountData.email,
        user.emailConfirmation.confirmationCode);
      usersRepository.addConfirmMessage(user._id, mail);
    } catch (error) {
      console.error(error);
      await usersRepository.deleteUserById(user._id.toString());
      return errorEmail;
    };
    return newUserId;
  },

  async resendConfirmation(email: string) {
    const user = await usersQueryRepository.getUser(email);
    if (!user) return false;
    if (user.emailConfirmation.isConfirmed) return false;
    if (user.emailConfirmation.expirationDate < new Date()) return false;
    if (user.emailConfirmation.sentEmails.length > 5) return false;

    const newConfirmationCode = uuidv4();
    const newExpirationDate = add(new Date(), { hours: 24 });

    try {
      const mail = await emailManager.sendEmailConfirmation(
        user.accountData.email,
        newConfirmationCode);
      usersRepository.updateConfirmation(user._id, mail, newConfirmationCode, newExpirationDate);
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