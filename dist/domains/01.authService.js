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
const inversify_1 = require("inversify");
const models_1 = require("./../models");
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const add_1 = __importDefault(require("date-fns/add"));
const bson_1 = require("bson");
const jwt_service_1 = require("../application/jwt-service");
const email_manager_1 = require("../managers/email-manager");
const _05_usersDBRepo_1 = require("../repositories/05.usersDBRepo");
const _05_usersQRepo_1 = require("../repositories/05.usersQRepo");
const _06_tokensDBRepo_1 = require("../repositories/06.tokensDBRepo");
const _06_tokensQRepo_1 = require("../repositories/06.tokensQRepo");
const _08_passwordsRecDBRepo_1 = require("../repositories/08.passwordsRecDBRepo");
const models_2 = require("../models");
let AuthService = class AuthService {
    constructor(usersRepository, usersQueryRepository, tokensMetaRepository, tokensQueryMetaRepository, passwordRecoveryRepository) {
        this.usersRepository = usersRepository;
        this.usersQueryRepository = usersQueryRepository;
        this.tokensMetaRepository = tokensMetaRepository;
        this.tokensQueryMetaRepository = tokensQueryMetaRepository;
        this.passwordRecoveryRepository = passwordRecoveryRepository;
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
            const expiredAt = (0, add_1.default)(new Date(), { minutes: 60 }).toISOString();
            const accessToken = yield jwt_service_1.jwtService.createAccessJwt(user._id.toString());
            const refreshToken = yield jwt_service_1.jwtService
                .createRefreshJwt(user._id.toString(), deviceId, createdAt);
            const sessionData = new models_2.TokensMetaDBModel(new bson_1.ObjectID, createdAt, expiredAt, deviceId, ip, deviceName, user._id.toString());
            const sessionId = yield this.tokensMetaRepository.addSession(sessionData);
            const tokensDTO = new models_1.TokensDTO(accessToken, refreshToken);
            return new models_2.BLLResponse(200, tokensDTO);
        });
    }
    getNewTokensPair(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = yield jwt_service_1.jwtService.getPayloadRefToken(refreshToken);
            if (!payload)
                return new models_2.BLLResponse(401);
            const tokenCreatedAt = yield this.tokensQueryMetaRepository
                .getTokenMeta(payload.userId, payload.deviceId);
            if (!tokenCreatedAt)
                return new models_2.BLLResponse(401);
            if (payload.createdAt !== tokenCreatedAt)
                return new models_2.BLLResponse(401);
            const newAccessToken = yield jwt_service_1.jwtService.createAccessJwt(payload.userId);
            const createdAt = new Date().toISOString();
            const expiredAt = (0, add_1.default)(new Date(), { seconds: 20 }).toISOString();
            const newRefreshToken = yield jwt_service_1.jwtService
                .createRefreshJwt(payload.userId, payload.deviceId, createdAt);
            const updatedSession = yield this.tokensMetaRepository
                .updateSession(payload.createdAt, createdAt, expiredAt);
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
    confirmEmail(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const resErrorMessage = new models_2.FieldError('code');
            const resError = new models_2.APIErrorResult([resErrorMessage]);
            let user = yield this.usersQueryRepository.getUserByConfirm(code);
            if (!user || user.emailConfirmation.isConfirmed
                || user.emailConfirmation.expirationDate < new Date()) {
                return new models_2.BLLResponse(400, undefined, undefined, resError);
            }
            ;
            let updatedId = yield this.usersRepository.activateUser(user._id);
            return new models_2.BLLResponse(204);
        });
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
            const user = new models_2.UserDBModel(new bson_1.ObjectID(), {
                login: body.login,
                email: body.email,
                passwordHash,
                passwordSalt,
                createdAt: new Date().toISOString(),
            }, {
                confirmationCode: (0, uuid_1.v4)(),
                expirationDate: (0, add_1.default)(new Date(), { hours: 24 }),
                isConfirmed: false,
                sentEmails: []
            }, { ip });
            const newUserId = yield this.usersRepository.addUser(user);
            try {
                const mail = yield email_manager_1.emailManager.sendEmailConfirmation(user.accountData.email, user.emailConfirmation.confirmationCode);
                yield this.usersRepository.addConfirmMessage(user._id, mail);
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
            const newConfirmationCode = (0, uuid_1.v4)();
            const newExpirationDate = (0, add_1.default)(new Date(), { hours: 24 });
            try {
                const mail = yield email_manager_1.emailManager.sendEmailConfirmation(user.accountData.email, newConfirmationCode);
                yield this.usersRepository.updateConfirmation(user._id, mail, newConfirmationCode, newExpirationDate);
                return new models_2.BLLResponse(204);
            }
            catch (error) {
                console.error(error);
                return new models_2.BLLResponse(400); // Error if possible!!!
            }
            ;
        });
    }
    sendPasswordRecoveryCode(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.usersQueryRepository.getDBUser(email);
            if (!user)
                return null;
            yield this.passwordRecoveryRepository.deletePasswordData(user._id);
            const passwordData = new models_2.PasswordDataDBModel(new bson_1.ObjectID(), user._id, (0, uuid_1.v4)(), new Date().toISOString(), (0, add_1.default)(new Date(), { minutes: 10 }).toISOString());
            try {
                yield email_manager_1.emailManager.sendRecoveryPasswordCode(user.accountData.email, passwordData.passwordRecoveryCode);
                yield this.passwordRecoveryRepository.addData(passwordData);
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
            const userIsExist = yield this.usersQueryRepository
                .getDBUser(passwordData.userId.toString());
            if (!userIsExist)
                return new models_2.BLLResponse(400, undefined, undefined, resError);
            const passwordSalt = yield bcrypt_1.default.genSalt(10);
            const passwordHash = yield this._generateHash(newPassword, passwordSalt);
            const setNewPassword = yield this.usersRepository
                .updatePassword(passwordData.userId, passwordHash, passwordSalt);
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
    __param(0, (0, inversify_1.inject)(_05_usersDBRepo_1.UsersRepository)),
    __param(1, (0, inversify_1.inject)(_05_usersQRepo_1.UsersQueryRepository)),
    __param(2, (0, inversify_1.inject)(_06_tokensDBRepo_1.TokensMetaRepository)),
    __param(3, (0, inversify_1.inject)(_06_tokensQRepo_1.TokensQueryMetaRepository)),
    __param(4, (0, inversify_1.inject)(_08_passwordsRecDBRepo_1.PasswordRecoveryRepository)),
    __metadata("design:paramtypes", [_05_usersDBRepo_1.UsersRepository,
        _05_usersQRepo_1.UsersQueryRepository,
        _06_tokensDBRepo_1.TokensMetaRepository,
        _06_tokensQRepo_1.TokensQueryMetaRepository,
        _08_passwordsRecDBRepo_1.PasswordRecoveryRepository])
], AuthService);
exports.AuthService = AuthService;
;
