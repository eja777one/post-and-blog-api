import { inject, injectable } from 'inversify';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { jwtService } from '../../../application/jwt-service';
import { emailManager } from '../../../managers/email-manager';
import { UsersRepository } from '../infrastructure/usersDBRepo';
import { UsersQueryRepository } from '../infrastructure/usersQRepo';
import { tokensMetaModel, PasswordsRecoveryModel, UserModel }
  from './../../../db';
import { TokensMetaRepository }
  from '../../devices/infrastructure/tokensDBRepo';
import { TokensQueryMetaRepository }
  from '../../devices/infrastructure/tokensQRepo';
import { PasswordRecoveryRepository }
  from '../infrastructure/passwordsRecDBRepo';
import { UserInputModel, BLLResponse, FieldError, APIErrorResult, TokensDTO }
  from "../../../models";

@injectable()
export class AuthService {

  constructor(
    @inject(UsersRepository) protected usersRepository: UsersRepository,
    @inject(UsersQueryRepository) protected usersQueryRepository:
      UsersQueryRepository,
    @inject(TokensMetaRepository) protected tokensMetaRepository:
      TokensMetaRepository,
    @inject(TokensQueryMetaRepository) protected tokensQueryMetaRepository:
      TokensQueryMetaRepository,
    @inject(PasswordRecoveryRepository) protected passwordRecoveryRepository:
      PasswordRecoveryRepository,
  ) { }

  async createUser(body: UserInputModel, ip: string) {
    const loginOrEmail = body.email ? body.email : body.login;

    const isLoginOrEmailExist =
      await this.usersQueryRepository.findUser(loginOrEmail);

    if (isLoginOrEmailExist) {
      const resErrorMessage = new FieldError(
        isLoginOrEmailExist === 'emailIsExist' ? 'email' : 'login');
      const resError = new APIErrorResult([resErrorMessage]);
      return new BLLResponse<undefined>(400, undefined, undefined, resError);
    }

    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generateHash(body.password, passwordSalt);

    const user = UserModel.makeUser(body.login, body.email, passwordHash,
      passwordSalt, ip);

    const newUserId = await this.usersRepository.save(user);

    try {
      const mail = await emailManager.sendEmailConfirmation(
        user.accountData.email,
        user.emailConfirmation.confirmationCode);
      // await this.usersRepository.addConfirmMessage(user._id, mail);
    } catch (error) {
      console.error(error);
      await this.usersRepository.deleteUser(user._id.toString());
      return new BLLResponse<undefined>(400); // Error if possible!!!
    };

    return new BLLResponse<undefined>(204);
  }

  async resendConfirmation(email: string) {
    const user = await this.usersQueryRepository.getDBUser(email);

    if (!user || user.emailConfirmation.isConfirmed
      || user.emailConfirmation.expirationDate < new Date()) {

      const resErrorMessage = new FieldError('email');
      const resError = new APIErrorResult([resErrorMessage]);
      return new BLLResponse<undefined>(400, undefined, undefined, resError);
    };

    try {
      const newConfirmationCode = uuidv4();

      await emailManager.sendEmailConfirmation(user.accountData.email,
        newConfirmationCode);

      user.updateConfirmation(newConfirmationCode);
      await this.usersRepository.save(user);
      return new BLLResponse<undefined>(204);
    } catch (error) {
      console.error(error);
      return new BLLResponse<undefined>(400); // Error if possible!!!
    };
  }

  async confirmEmail(code: string) {
    let user = await this.usersQueryRepository.getUserByConfirm(code);

    if (!user || user.emailConfirmation.isConfirmed
      || user.emailConfirmation.expirationDate < new Date()) {
      const resErrorMessage = new FieldError('code');
      const resError = new APIErrorResult([resErrorMessage]);
      return new BLLResponse<undefined>(400, undefined, undefined, resError);
    };

    user.activateUser();
    let updatedId = await this.usersRepository.save(user);

    return new BLLResponse<undefined>(204);
  }

  async checkAuth(loginOrEmail: string, password: string, ip: string,
    deviceName: string) {
    const user = await this.usersQueryRepository.getDBUser(loginOrEmail);

    if (!user || !user.emailConfirmation.isConfirmed)
      return new BLLResponse<undefined>(401);

    const inputPass = await this
      ._generateHash(password, user.accountData.passwordSalt);

    if (inputPass !== user.accountData.passwordHash)
      return new BLLResponse<undefined>(401);

    const checkSession = await this.tokensQueryMetaRepository
      .checkSession(ip, deviceName, user._id.toString());

    if (checkSession) {
      await this.tokensMetaRepository.deleteSessionBeforeLogin(
        ip, deviceName, user._id.toString())
    };

    const deviceId = uuidv4();
    const createdAt = new Date().toISOString();

    const accessToken = await jwtService.createAccessJwt(user._id.toString());

    const refreshToken = await jwtService
      .createRefreshJwt(user._id.toString(), deviceId, createdAt);

    const sessionData = tokensMetaModel.makeSession(createdAt, deviceId, ip,
      deviceName, user._id.toString());

    const sessionId = await this.tokensMetaRepository.save(sessionData);

    const tokensDTO = new TokensDTO(accessToken, refreshToken);
    return new BLLResponse<TokensDTO>(200, tokensDTO);
  }

  async getNewTokensPair(refreshToken: string) {
    const payload = await jwtService.getPayloadRefToken(refreshToken);
    if (!payload) return new BLLResponse<undefined>(401);

    const tokenMeta = await this.tokensQueryMetaRepository
      .getTokenMeta(payload.userId, payload.deviceId);

    if (!tokenMeta || payload.createdAt !== tokenMeta.createdAt)
      return new BLLResponse<undefined>(401);

    const newAccessToken = await jwtService.createAccessJwt(payload.userId);

    const createdAt = new Date().toISOString();

    const newRefreshToken = await jwtService
      .createRefreshJwt(payload.userId, payload.deviceId, createdAt);

    tokenMeta.updateSession(createdAt);
    const updatedSession = await this.tokensMetaRepository.save(tokenMeta);

    const tokensDTO = new TokensDTO(newAccessToken, newRefreshToken);
    return new BLLResponse<TokensDTO>(200, tokensDTO);
  }

  async deleteRefreshToken(refreshToken: string) {
    const payload = await jwtService.getExpiredPayloadRefToken(refreshToken);
    if (!payload) return new BLLResponse<undefined>(401);

    const deletedSession = await this.tokensMetaRepository
      .deleteSessionBeforeLogout(payload.userId, payload.deviceId);

    if (deletedSession) return new BLLResponse<undefined>(204);
    else return new BLLResponse<undefined>(401);
  }

  async sendPasswordRecoveryCode(email: string) {
    const user = await this.usersQueryRepository.getDBUser(email);
    if (!user) return null;

    await this.passwordRecoveryRepository.deletePasswordData(user._id);

    const passwordData = PasswordsRecoveryModel.makePasswordData(user._id);

    try {
      await emailManager.sendRecoveryPasswordCode(
        user.accountData.email,
        passwordData.passwordRecoveryCode
      );
      await this.passwordRecoveryRepository.save(passwordData);
      return true;
    } catch (error) {
      return false;
    };
  }

  async updatePassword(newPassword: string, code: string) {
    const resErrorMessage = new FieldError('recoveryCode');
    const resError = new APIErrorResult([resErrorMessage]);

    const passwordData = await this.passwordRecoveryRepository.getData(code);

    if (!passwordData)
      return new BLLResponse<undefined>(400, undefined, undefined, resError);

    if (new Date(passwordData.expiredAt) < new Date()) {

      await this.passwordRecoveryRepository
        .deletePasswordData(passwordData.userId);

      return new BLLResponse<undefined>(400, undefined, undefined, resError);
    };

    const user = await this.usersQueryRepository
      .getDBUser(passwordData.userId.toString());

    if (!user)
      return new BLLResponse<undefined>(400, undefined, undefined, resError);

    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generateHash(newPassword, passwordSalt);

    user.updatePassword(passwordHash, passwordSalt);
    const setNewPassword = await this.usersRepository.save(user);

    if (!setNewPassword)
      return new BLLResponse<undefined>(400, undefined, undefined, resError);

    return new BLLResponse<undefined>(204);
  }

  async _generateHash(password: string, salt: string) {
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }
};