import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import add from 'date-fns/add';
import { ObjectID } from 'bson';
import { jwtService } from '../application/jwt-service';
import { emailManager } from '../managers/email-manager';
import { UsersRepository } from '../repositories/05.usersDBRepo';
import { UsersQueryRepository } from '../repositories/05.usersQRepo';
import { TokensMetaRepository } from '../repositories/06.tokensDBRepo';
import { TokensQueryMetaRepository } from '../repositories/06.tokensQRepo';
import { PasswordRecoveryRepository } from '../repositories/08.passwordsRecDBRepo';
import { TokensMetaDBModel, UserInputModel, PasswordDataDBModel, UserDBModel }
  from "../models";

export class AuthService {

  usersRepository: UsersRepository
  usersQueryRepository: UsersQueryRepository
  tokensMetaRepository: TokensMetaRepository
  tokensQueryMetaRepository: TokensQueryMetaRepository
  passwordRecoveryRepository: PasswordRecoveryRepository

  constructor() {
    this.usersRepository = new UsersRepository();
    this.usersQueryRepository = new UsersQueryRepository();
    this.tokensMetaRepository = new TokensMetaRepository();
    this.tokensQueryMetaRepository = new TokensQueryMetaRepository();
    this.passwordRecoveryRepository = new PasswordRecoveryRepository();
  }

  async checkAuth(loginOrEmail: string, password: string, ip: string,
    deviceName: string) {

    const user = await this.usersQueryRepository.getDBUser(loginOrEmail);
    if (!user || !user.emailConfirmation.isConfirmed) return null;

    const inputPass = await this
      ._generateHash(password, user.accountData.passwordSalt);

    if (inputPass !== user.accountData.passwordHash) return null;

    const checkSession = await this.tokensQueryMetaRepository
      .checkSession(ip, deviceName, user._id.toString());

    if (checkSession) {
      await this.tokensMetaRepository.deleteSessionBeforeLogin(
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

    const sessionId = await this.tokensMetaRepository.addSession(sessionData);

    return { accessToken, refreshToken };
  }

  async getNewTokensPair(refreshToken: string) {

    const payload = await jwtService.getPayloadRefToken(refreshToken);
    if (!payload) return null;

    const tokenCreatedAt = await this.tokensQueryMetaRepository
      .getTokenMeta(payload.userId, payload.deviceId);

    if (!tokenCreatedAt) return null;

    if (payload.createdAt !== tokenCreatedAt) return null;

    const newAccessToken = await jwtService.createAccessJwt(payload.userId);

    const createdAt = new Date().toISOString();
    const expiredAt = add(new Date(), { seconds: 20 }).toISOString()

    const newRefreshToken = await jwtService
      .createRefreshJwt(payload.userId, payload.deviceId, createdAt);

    const updatedSession = await this.tokensMetaRepository
      .updateSession(payload.createdAt, createdAt, expiredAt);

    return { newAccessToken, newRefreshToken };
  }

  async deleteRefreshToken(refreshToken: string) {

    const payload = await jwtService.getExpiredPayloadRefToken(refreshToken);
    if (!payload) return false;

    const deletedSession = await this.tokensMetaRepository
      .deleteSessionBeforeLogout(payload.userId, payload.deviceId);

    return deletedSession;
  }

  async confirmEmail(code: string) {
    let user = await this.usersQueryRepository.getUserByConfirm(code);

    if (!user || user.emailConfirmation.isConfirmed) return false;
    if (user.emailConfirmation.expirationDate < new Date()) return false;

    let updatedId = await this.usersRepository.activateUser(user._id);

    return true;
  }

  async createUser(body: UserInputModel, ip: string) {
    const loginOrEmail = body.email ? body.email : body.login;

    const isLoginOrEmailExist =
      await this.usersQueryRepository.findUser(loginOrEmail);

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

    const newUserId = await this.usersRepository.addUser(user);

    try {
      const mail = await emailManager.sendEmailConfirmation(
        user.accountData.email,
        user.emailConfirmation.confirmationCode);
      await this.usersRepository.addConfirmMessage(user._id, mail);
    } catch (error) {
      console.error(error);
      await this.usersRepository.deleteUser(user._id.toString());
      return false;
    };

    return true;
  }

  async resendConfirmation(email: string) {
    const user = await this.usersQueryRepository.getDBUser(email);

    if (!user || user.emailConfirmation.isConfirmed) return false;
    if (user.emailConfirmation.expirationDate < new Date()) return false;

    const newConfirmationCode = uuidv4();
    const newExpirationDate = add(new Date(), { hours: 24 });

    try {
      const mail = await emailManager.sendEmailConfirmation(
        user.accountData.email,
        newConfirmationCode
      );
      await this.usersRepository.updateConfirmation(
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
    const user = await this.usersQueryRepository.getDBUser(email);
    if (!user) return null;

    await this.passwordRecoveryRepository.deletePasswordData(user._id);

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
      await this.passwordRecoveryRepository.addData(passwordData);
      return true;
    } catch (error) {
      return false;
    };
  }

  async updatePassword(newPassword: string, code: string) {

    const passwordData = await this.passwordRecoveryRepository.getData(code);
    if (!passwordData) return false;

    if (new Date(passwordData.expiredAt) < new Date()) {

      await this.passwordRecoveryRepository
        .deletePasswordData(passwordData.userId);

      return false;
    };

    const userIsExist = await this.usersQueryRepository
      .getDBUser(passwordData.userId.toString());

    if (!userIsExist) return false;

    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generateHash(newPassword, passwordSalt);

    const setNewPassword = await this.usersRepository
      .updatePassword(passwordData.userId, passwordHash, passwordSalt);

    if (!setNewPassword) return false;

    return true;
  }

  async _generateHash(password: string, salt: string) {
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }
};