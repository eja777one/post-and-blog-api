import { passwordRecoveryRepository } from './../repositories/08.passwordsRecoveryDBRepositury';
import { tokensQueryMetaRepository } from './../repositories/06.tokensQueryRepository';
import { tokensMetaRepository } from '../repositories/06.tokensDBRepository';
import { emailManager } from '../managers/email-manager';
import { usersRepository } from '../repositories/05.usersDbRepository';
import { usersQueryRepository } from '../repositories/05.usersQueryRepository';
import { ObjectID } from 'bson';
import { TokensMetaDBModel, UserInputModel } from "../models";
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import add from 'date-fns/add';
import { jwtService } from '../application/jwt-service';

export const authServices = {

  async checkAuth(
    loginOrEmail: string,
    password: string,
    ip: string | string[] | null,
    deviceName: string) {

    const user = await usersQueryRepository.getUser(loginOrEmail);

    if (!user) return null;
    if (!user.emailConfirmation.isConfirmed) return null;

    const inputPass = await this
      ._generateHash(password, user.accountData.passwordSalt);

    if (inputPass !== user.accountData.passwordHash) return null;

    const checkSession = await tokensQueryMetaRepository
      .checkSession(ip, deviceName, user._id.toString());

    if (checkSession) {
      await tokensMetaRepository.deleteSessionBeforeLogin(
        ip, deviceName, user._id.toString())
    };

    const deviceId = uuidv4();
    const createdAt = new Date().toISOString();

    const accessToken = await jwtService
      .createAccessJwt(user._id.toString());

    const refreshToken = await jwtService
      .createRefreshJwt(user._id.toString(), deviceId, createdAt);

    const sessionData: TokensMetaDBModel = {
      ip,
      deviceId,
      deviceName,
      _id: new ObjectID(),
      userId: user._id.toString(),
      createdAt,
      expiredAt: add(new Date(), { seconds: 20 }).toISOString(),
    };

    await tokensMetaRepository.addSession(sessionData);

    return { accessToken, refreshToken };
  },

  async getNewTokensPair(refreshToken: string) {
    const payload = await jwtService.
      getPayloadRefToken(refreshToken);

    if (!payload) return null;

    const tokenCreatedAt = await tokensQueryMetaRepository
      .getTokenMeta(payload.userId, payload.deviceId);

    if (!tokenCreatedAt) return null;

    if (payload.createdAt !== tokenCreatedAt) return null;

    const newAccessToken = await jwtService
      .createAccessJwt(payload.userId);

    const createdAt = new Date().toISOString();
    const expiredAt = add(new Date(), { seconds: 20 }).toISOString()

    const newRefreshToken = await jwtService
      .createRefreshJwt(payload.userId, payload.deviceId, createdAt);

    const updatedSession = await tokensMetaRepository
      .updateSession(payload.createdAt, createdAt, expiredAt);

    return { newAccessToken, newRefreshToken };
  },

  async deleteRefreshToken(refreshToken: string) {
    const payload = await jwtService
      .getExpiredPayloadRefToken(refreshToken);

    if (!payload) return false;

    const deletedSession = await tokensMetaRepository
      .deleteSessionBeforeLogout(payload.userId, payload.deviceId);

    return deletedSession === 1;
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
      _id: new ObjectID(),
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
      registrationDataType: {
        ip,
      }
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

    const newConfirmationCode = uuidv4();
    const newExpirationDate = add(new Date(), { hours: 24 });

    try {
      const mail = await emailManager.sendEmailConfirmation(
        user.accountData.email,
        newConfirmationCode
      );
      usersRepository.updateConfirmation(
        user._id,
        mail,
        newConfirmationCode,
        newExpirationDate
      );
      return true;
    } catch (error) {
      console.error(error);
      return false;
    };
  },

  async sendPasswordRecoveryCode(email: string) {
    const user = await usersQueryRepository.getUser(email);
    if (!user) return null;
    const passwordRecoveryCode = await jwtService
      .createPasswordRecoveryJwt(user._id.toString());

    try {
      await emailManager.sendRecoveryPasswordCode(
        user.accountData.email,
        passwordRecoveryCode
      );
      await passwordRecoveryRepository
        .addCode(passwordRecoveryCode);
      return true;
    } catch (error) {
      return false;
    };
  },

  async updatePassword(newPassword: string, code: string) {
    const deleteCode = await
      passwordRecoveryRepository.deleteCode(code);

    if (!deleteCode) return false;

    const userId = await jwtService
      .getPayloadPasswordRecovery(code);

    if (!userId) return false;

    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this
      ._generateHash(newPassword, passwordSalt);

    const setNewPassword = await usersRepository
      .updatePassword(new ObjectID(userId), passwordHash, passwordSalt);

    if (!setNewPassword) return false;
    else return true;
  },

  async _generateHash(password: string, salt: string) {
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }
};