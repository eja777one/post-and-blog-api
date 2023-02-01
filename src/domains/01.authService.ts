import { PasswordDataDBModel, UserDBModel } from '../models';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import add from 'date-fns/add';
import { ObjectID } from 'bson';
import { emailManager } from '../managers/email-manager';
import { usersRepository } from '../repositories/05.usersDBRepo';
import { usersQueryRepository } from '../repositories/05.usersQRepo';
import { tokensMetaRepository } from '../repositories/06.tokensDBRepo';
import { tokensQueryMetaRepository } from '../repositories/06.tokensQRepo';
import { passwordRecoveryRepository } from '../repositories/08.passwordsRecDBRepo';
import { TokensMetaDBModel, UserInputModel } from "../models";
import { jwtService } from '../application/jwt-service';

class AuthService {

  async checkAuth(loginOrEmail: string, password: string, ip: string,
    deviceName: string) {

    const user = await usersQueryRepository.getDBUser(loginOrEmail);
    if (!user || !user.emailConfirmation.isConfirmed) return null;

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
    const expiredAt = add(new Date(), { seconds: 20 }).toISOString();

    const accessToken = await jwtService.createAccessJwt(user._id.toString());

    const refreshToken = await jwtService
      .createRefreshJwt(user._id.toString(), deviceId, createdAt);

    const sessionData = new TokensMetaDBModel(
      new ObjectID,
      createdAt,
      expiredAt,
      deviceId,
      ip, deviceName,
      user._id.toString()
    );

    const sessionId = await tokensMetaRepository.addSession(sessionData);

    return { accessToken, refreshToken };
  }

  async getNewTokensPair(refreshToken: string) {

    const payload = await jwtService.getPayloadRefToken(refreshToken);
    if (!payload) return null;

    const tokenCreatedAt = await tokensQueryMetaRepository
      .getTokenMeta(payload.userId, payload.deviceId);

    if (!tokenCreatedAt) return null;

    if (payload.createdAt !== tokenCreatedAt) return null;

    const newAccessToken = await jwtService.createAccessJwt(payload.userId);

    const createdAt = new Date().toISOString();
    const expiredAt = add(new Date(), { seconds: 20 }).toISOString()

    const newRefreshToken = await jwtService
      .createRefreshJwt(payload.userId, payload.deviceId, createdAt);

    const updatedSession = await tokensMetaRepository
      .updateSession(payload.createdAt, createdAt, expiredAt);

    return { newAccessToken, newRefreshToken };
  }

  async deleteRefreshToken(refreshToken: string) {

    const payload = await jwtService.getExpiredPayloadRefToken(refreshToken);
    if (!payload) return false;

    const deletedSession = await tokensMetaRepository
      .deleteSessionBeforeLogout(payload.userId, payload.deviceId);

    return deletedSession;
  }

  async confirmEmail(code: string) {
    let user = await usersQueryRepository.getUserByConfirm(code);

    if (!user || user.emailConfirmation.isConfirmed) return false;
    if (user.emailConfirmation.expirationDate < new Date()) return false;

    let updatedId = await usersRepository.activateUser(user._id);

    return true;
  }

  async createUser(body: UserInputModel, ip: string) {
    const loginOrEmail = body.email ? body.email : body.login;

    const isLoginOrEmailExist =
      await usersQueryRepository.findUser(loginOrEmail);

    if (isLoginOrEmailExist) return isLoginOrEmailExist;

    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generateHash(body.password, passwordSalt);

    const user = new UserDBModel(
      new ObjectID(),
      {
        login: body.login,
        email: body.email,
        passwordHash,
        passwordSalt,
        createdAt: new Date().toISOString(),
      },
      {
        confirmationCode: uuidv4(),
        expirationDate: add(new Date(), { hours: 24 }),
        isConfirmed: false,
        sentEmails: []
      },
      { ip }
    );

    const newUserId = await usersRepository.addUser(user);

    try {
      const mail = await emailManager.sendEmailConfirmation(
        user.accountData.email,
        user.emailConfirmation.confirmationCode);
      usersRepository.addConfirmMessage(user._id, mail);
    } catch (error) {
      console.error(error);
      await usersRepository.deleteUser(user._id.toString());
      return false;
    };

    return true;
  }

  async resendConfirmation(email: string) {
    const user = await usersQueryRepository.getDBUser(email);

    if (!user || user.emailConfirmation.isConfirmed) return false;
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
  }

  async sendPasswordRecoveryCode(email: string) {
    const user = await usersQueryRepository.getDBUser(email);
    if (!user) return null;

    await passwordRecoveryRepository.deletePasswordData(user._id);

    const passwordData = new PasswordDataDBModel(
      new ObjectID(),
      user._id,
      uuidv4(),
      new Date().toISOString(),
      add(new Date(), { minutes: 10 }).toISOString(),
    );

    try {
      await emailManager.sendRecoveryPasswordCode(
        user.accountData.email,
        passwordData.passwordRecoveryCode
      );
      await passwordRecoveryRepository.addData(passwordData);
      return true;
    } catch (error) {
      return false;
    };
  }

  async updatePassword(newPassword: string, code: string) {

    const passwordData = await passwordRecoveryRepository.getData(code);
    if (!passwordData) return false;

    if (new Date(passwordData.expiredAt) < new Date()) {

      await passwordRecoveryRepository.deletePasswordData(passwordData.userId);

      return false;
    };

    const userIsExist = await usersQueryRepository
      .getDBUser(passwordData.userId.toString());

    if (!userIsExist) return false;

    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generateHash(newPassword, passwordSalt);

    const setNewPassword = await usersRepository
      .updatePassword(passwordData.userId, passwordHash, passwordSalt);

    if (!setNewPassword) return false;

    return true;
  }

  async _generateHash(password: string, salt: string) {
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }
};

export const authService = new AuthService();