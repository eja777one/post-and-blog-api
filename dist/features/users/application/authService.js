"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const db_1 = require("./../../../db");
const inversify_1 = require("inversify");
const models_1 = require("../../../models");
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const jwt_service_1 = require("../../../application/jwt-service");
const email_manager_1 = require("../../../managers/email-manager");
const usersDBRepo_1 = require("../infrastructure/usersDBRepo");
const usersQRepo_1 = require("../infrastructure/usersQRepo");
const tokensDBRepo_1 = require("../../devices/infrastructure/tokensDBRepo");
const tokensQRepo_1 = require("../../devices/infrastructure/tokensQRepo");
const passwordsRecDBRepo_1 = require("../infrastructure/passwordsRecDBRepo");
const models_2 = require("../../../models");
const db_2 = require("../../../db");
let AuthService = class AuthService {
    constructor(usersRepository, usersQueryRepository, tokensMetaRepository, tokensQueryMetaRepository, passwordRecoveryRepository) {
        this.usersRepository = usersRepository;
        this.usersQueryRepository = usersQueryRepository;
        this.tokensMetaRepository = tokensMetaRepository;
        this.tokensQueryMetaRepository = tokensQueryMetaRepository;
        this.passwordRecoveryRepository = passwordRecoveryRepository;
    }
    createUser(body, ip) {
        return __awaiter(this, void 0, void 0, function* () {
            const loginOrEmail = body.email ? body.email : body.login;
            const isLoginOrEmailExist = yield this.usersQueryRepository.findUser(loginOrEmail);
            if (isLoginOrEmailExist) {
                const resErrorMessage = new models_2.FieldError(isLoginOrEmailExist === 'emailIsExist' ? 'email' : 'login');
                const resError = new models_2.APIErrorResult([resErrorMessage]);
                return new models_2.BLLResponse(400, undefined, undefined, resError);
            }
            const passwordSalt = yield bcrypt_1.default.genSalt(10);
            const passwordHash = yield this._generateHash(body.password, passwordSalt);
            const user = db_2.UserModel.makeUser(body.login, body.email, passwordHash, passwordSalt, ip);
            const newUserId = yield this.usersRepository.save(user);
            try {
                const mail = yield email_manager_1.emailManager.sendEmailConfirmation(user.accountData.email, user.emailConfirmation.confirmationCode);
                // await this.usersRepository.addConfirmMessage(user._id, mail);
            }
            catch (error) {
                console.error(error);
                yield this.usersRepository.deleteUser(user._id.toString());
                return new models_2.BLLResponse(400); // Error if possible!!!
            }
            ;
            return new models_2.BLLResponse(204);
        });
    }
    resendConfirmation(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.usersQueryRepository.getDBUser(email);
            if (!user || user.emailConfirmation.isConfirmed
                || user.emailConfirmation.expirationDate < new Date()) {
                const resErrorMessage = new models_2.FieldError('email');
                const resError = new models_2.APIErrorResult([resErrorMessage]);
                return new models_2.BLLResponse(400, undefined, undefined, resError);
            }
            ;
            try {
                const newConfirmationCode = (0, uuid_1.v4)();
                yield email_manager_1.emailManager.sendEmailConfirmation(user.accountData.email, newConfirmationCode);
                user.updateConfirmation(newConfirmationCode);
                yield this.usersRepository.save(user);
                return new models_2.BLLResponse(204);
            }
            catch (error) {
                console.error(error);
                return new models_2.BLLResponse(400); // Error if possible!!!
            }
            ;
        });
    }
    confirmEmail(code) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield this.usersQueryRepository.getUserByConfirm(code);
            if (!user || user.emailConfirmation.isConfirmed
                || user.emailConfirmation.expirationDate < new Date()) {
                const resErrorMessage = new models_2.FieldError('code');
                const resError = new models_2.APIErrorResult([resErrorMessage]);
                return new models_2.BLLResponse(400, undefined, undefined, resError);
            }
            ;
            user.activateUser();
            let updatedId = yield this.usersRepository.save(user);
            return new models_2.BLLResponse(204);
        });
    }
    checkAuth(loginOrEmail, password, ip, deviceName) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.usersQueryRepository.getDBUser(loginOrEmail);
            if (!user || !user.emailConfirmation.isConfirmed)
                return new models_2.BLLResponse(401);
            const inputPass = yield this
                ._generateHash(password, user.accountData.passwordSalt);
            if (inputPass !== user.accountData.passwordHash)
                return new models_2.BLLResponse(401);
            const checkSession = yield this.tokensQueryMetaRepository
                .checkSession(ip, deviceName, user._id.toString());
            if (checkSession) {
                yield this.tokensMetaRepository.deleteSessionBeforeLogin(ip, deviceName, user._id.toString());
            }
            ;
            const deviceId = (0, uuid_1.v4)();
            const createdAt = new Date().toISOString();
            const accessToken = yield jwt_service_1.jwtService.createAccessJwt(user._id.toString());
            const refreshToken = yield jwt_service_1.jwtService
                .createRefreshJwt(user._id.toString(), deviceId, createdAt);
            const sessionData = db_1.tokensMetaModel.makeSession(createdAt, deviceId, ip, deviceName, user._id.toString());
            const sessionId = yield this.tokensMetaRepository.save(sessionData);
            const tokensDTO = new models_1.TokensDTO(accessToken, refreshToken);
            return new models_2.BLLResponse(200, tokensDTO);
        });
    }
    getNewTokensPair(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = yield jwt_service_1.jwtService.getPayloadRefToken(refreshToken);
            if (!payload)
                return new models_2.BLLResponse(401);
            const tokenMeta = yield this.tokensQueryMetaRepository
                .getTokenMeta(payload.userId, payload.deviceId);
            if (!tokenMeta || payload.createdAt !== tokenMeta.createdAt)
                return new models_2.BLLResponse(401);
            const newAccessToken = yield jwt_service_1.jwtService.createAccessJwt(payload.userId);
            const createdAt = new Date().toISOString();
            const newRefreshToken = yield jwt_service_1.jwtService
                .createRefreshJwt(payload.userId, payload.deviceId, createdAt);
            tokenMeta.updateSession(createdAt);
            const updatedSession = yield this.tokensMetaRepository.save(tokenMeta);
            const tokensDTO = new models_1.TokensDTO(newAccessToken, newRefreshToken);
            return new models_2.BLLResponse(200, tokensDTO);
        });
    }
    deleteRefreshToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = yield jwt_service_1.jwtService.getExpiredPayloadRefToken(refreshToken);
            if (!payload)
                return new models_2.BLLResponse(401);
            const deletedSession = yield this.tokensMetaRepository
                .deleteSessionBeforeLogout(payload.userId, payload.deviceId);
            if (deletedSession)
                return new models_2.BLLResponse(204);
            else
                return new models_2.BLLResponse(401);
        });
    }
    sendPasswordRecoveryCode(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.usersQueryRepository.getDBUser(email);
            if (!user)
                return null;
            yield this.passwordRecoveryRepository.deletePasswordData(user._id);
            const passwordData = db_1.PasswordsRecoveryModel.makePasswordData(user._id);
            try {
                yield email_manager_1.emailManager.sendRecoveryPasswordCode(user.accountData.email, passwordData.passwordRecoveryCode);
                yield this.passwordRecoveryRepository.save(passwordData);
                return true;
            }
            catch (error) {
                return false;
            }
            ;
        });
    }
    updatePassword(newPassword, code) {
        return __awaiter(this, void 0, void 0, function* () {
            const resErrorMessage = new models_2.FieldError('recoveryCode');
            const resError = new models_2.APIErrorResult([resErrorMessage]);
            const passwordData = yield this.passwordRecoveryRepository.getData(code);
            if (!passwordData)
                return new models_2.BLLResponse(400, undefined, undefined, resError);
            if (new Date(passwordData.expiredAt) < new Date()) {
                yield this.passwordRecoveryRepository
                    .deletePasswordData(passwordData.userId);
                return new models_2.BLLResponse(400, undefined, undefined, resError);
            }
            ;
            const user = yield this.usersQueryRepository
                .getDBUser(passwordData.userId.toString());
            if (!user)
                return new models_2.BLLResponse(400, undefined, undefined, resError);
            const passwordSalt = yield bcrypt_1.default.genSalt(10);
            const passwordHash = yield this._generateHash(newPassword, passwordSalt);
            user.updatePassword(passwordHash, passwordSalt);
            const setNewPassword = yield this.usersRepository.save(user);
            // const setNewPassword = await this.usersRepository
            //   .updatePassword(passwordData.userId, passwordHash, passwordSalt);
            if (!setNewPassword)
                return new models_2.BLLResponse(400, undefined, undefined, resError);
            return new models_2.BLLResponse(204);
        });
    }
    _generateHash(password, salt) {
        return __awaiter(this, void 0, void 0, function* () {
            const hash = yield bcrypt_1.default.hash(password, salt);
            return hash;
        });
    }
};
AuthService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(usersDBRepo_1.UsersRepository)),
    __param(1, (0, inversify_1.inject)(usersQRepo_1.UsersQueryRepository)),
    __param(2, (0, inversify_1.inject)(tokensDBRepo_1.TokensMetaRepository)),
    __param(3, (0, inversify_1.inject)(tokensQRepo_1.TokensQueryMetaRepository)),
    __param(4, (0, inversify_1.inject)(passwordsRecDBRepo_1.PasswordRecoveryRepository)),
    __metadata("design:paramtypes", [usersDBRepo_1.UsersRepository,
        usersQRepo_1.UsersQueryRepository,
        tokensDBRepo_1.TokensMetaRepository,
        tokensQRepo_1.TokensQueryMetaRepository,
        passwordsRecDBRepo_1.PasswordRecoveryRepository])
], AuthService);
exports.AuthService = AuthService;
;
