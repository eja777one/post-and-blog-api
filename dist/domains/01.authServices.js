"use strict";
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
exports.authServices = void 0;
const _08_passwordsRecoveryDBRepositury_1 = require("./../repositories/08.passwordsRecoveryDBRepositury");
const _06_tokensQueryRepository_1 = require("./../repositories/06.tokensQueryRepository");
const _06_tokensDBRepository_1 = require("../repositories/06.tokensDBRepository");
const email_manager_1 = require("../managers/email-manager");
const _05_usersDbRepository_1 = require("../repositories/05.usersDbRepository");
const _05_usersQueryRepository_1 = require("../repositories/05.usersQueryRepository");
const bson_1 = require("bson");
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const add_1 = __importDefault(require("date-fns/add"));
const jwt_service_1 = require("../application/jwt-service");
exports.authServices = {
    checkAuth(loginOrEmail, password, ip, deviceName) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield _05_usersQueryRepository_1.usersQueryRepository.getUser(loginOrEmail);
            if (!user)
                return null;
            if (!user.emailConfirmation.isConfirmed)
                return null;
            const inputPass = yield this
                ._generateHash(password, user.accountData.passwordSalt);
            if (inputPass !== user.accountData.passwordHash)
                return null;
            const checkSession = yield _06_tokensQueryRepository_1.tokensQueryMetaRepository
                .checkSession(ip, deviceName, user._id.toString());
            if (checkSession) {
                yield _06_tokensDBRepository_1.tokensMetaRepository.deleteSessionBeforeLogin(ip, deviceName, user._id.toString());
            }
            ;
            const deviceId = (0, uuid_1.v4)();
            const createdAt = new Date().toISOString();
            const accessToken = yield jwt_service_1.jwtService
                .createAccessJwt(user._id.toString());
            const refreshToken = yield jwt_service_1.jwtService
                .createRefreshJwt(user._id.toString(), deviceId, createdAt);
            const sessionData = {
                ip,
                deviceId,
                deviceName,
                _id: new bson_1.ObjectID(),
                userId: user._id.toString(),
                createdAt,
                expiredAt: (0, add_1.default)(new Date(), { seconds: 20 }).toISOString(),
            };
            yield _06_tokensDBRepository_1.tokensMetaRepository.addSession(sessionData);
            return { accessToken, refreshToken };
        });
    },
    getNewTokensPair(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = yield jwt_service_1.jwtService.
                getPayloadRefToken(refreshToken);
            if (!payload)
                return null;
            const tokenCreatedAt = yield _06_tokensQueryRepository_1.tokensQueryMetaRepository
                .getTokenMeta(payload.userId, payload.deviceId);
            if (!tokenCreatedAt)
                return null;
            if (payload.createdAt !== tokenCreatedAt)
                return null;
            const newAccessToken = yield jwt_service_1.jwtService
                .createAccessJwt(payload.userId);
            const createdAt = new Date().toISOString();
            const expiredAt = (0, add_1.default)(new Date(), { seconds: 20 }).toISOString();
            const newRefreshToken = yield jwt_service_1.jwtService
                .createRefreshJwt(payload.userId, payload.deviceId, createdAt);
            const updatedSession = yield _06_tokensDBRepository_1.tokensMetaRepository
                .updateSession(payload.createdAt, createdAt, expiredAt);
            return { newAccessToken, newRefreshToken };
        });
    },
    deleteRefreshToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = yield jwt_service_1.jwtService
                .getExpiredPayloadRefToken(refreshToken);
            if (!payload)
                return false;
            const deletedSession = yield _06_tokensDBRepository_1.tokensMetaRepository
                .deleteSessionBeforeLogout(payload.userId, payload.deviceId);
            return deletedSession === 1;
        });
    },
    confirmEmail(code) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield _05_usersQueryRepository_1.usersQueryRepository.getUserByConfirm(code);
            if (!user)
                return null;
            if (user.emailConfirmation.isConfirmed)
                return null;
            if (user.emailConfirmation.expirationDate < new Date())
                return null;
            let updatedId = yield _05_usersDbRepository_1.usersRepository.activateUser(user._id);
            return updatedId;
        });
    },
    createUser(body, ip) {
        return __awaiter(this, void 0, void 0, function* () {
            const isEmailExist = yield _05_usersQueryRepository_1.usersQueryRepository.getUser(body.email);
            const isLoginExist = yield _05_usersQueryRepository_1.usersQueryRepository.getUser(body.login);
            const errorEmail = { errorsMessages: [{ message: 'incorrect email', field: 'email' }] };
            const errorLogin = { errorsMessages: [{ message: 'incorrect login', field: 'login' }] };
            if (isEmailExist)
                return errorEmail;
            if (isLoginExist)
                return errorLogin;
            const passwordSalt = yield bcrypt_1.default.genSalt(10);
            const passwordHash = yield this
                ._generateHash(body.password, passwordSalt);
            const user = {
                _id: new bson_1.ObjectID(),
                accountData: {
                    login: body.login,
                    email: body.email,
                    passwordHash,
                    passwordSalt,
                    createdAt: new Date().toISOString(),
                },
                emailConfirmation: {
                    confirmationCode: (0, uuid_1.v4)(),
                    expirationDate: (0, add_1.default)(new Date(), { hours: 24 }),
                    isConfirmed: false,
                    sentEmails: []
                },
                registrationDataType: {
                    ip,
                }
            };
            const newUserId = yield _05_usersDbRepository_1.usersRepository.addUser(user);
            try {
                const mail = yield email_manager_1.emailManager.sendEmailConfirmation(user.accountData.email, user.emailConfirmation.confirmationCode);
                _05_usersDbRepository_1.usersRepository.addConfirmMessage(user._id, mail);
            }
            catch (error) {
                console.error(error);
                yield _05_usersDbRepository_1.usersRepository.deleteUserById(user._id.toString());
                return errorEmail;
            }
            ;
            return newUserId;
        });
    },
    resendConfirmation(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield _05_usersQueryRepository_1.usersQueryRepository.getUser(email);
            if (!user)
                return false;
            if (user.emailConfirmation.isConfirmed)
                return false;
            if (user.emailConfirmation.expirationDate < new Date())
                return false;
            const newConfirmationCode = (0, uuid_1.v4)();
            const newExpirationDate = (0, add_1.default)(new Date(), { hours: 24 });
            try {
                const mail = yield email_manager_1.emailManager.sendEmailConfirmation(user.accountData.email, newConfirmationCode);
                _05_usersDbRepository_1.usersRepository.updateConfirmation(user._id, mail, newConfirmationCode, newExpirationDate);
                return true;
            }
            catch (error) {
                console.error(error);
                return false;
            }
            ;
        });
    },
    sendPasswordRecoveryCode(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield _05_usersQueryRepository_1.usersQueryRepository.getUser(email);
            if (!user)
                return null;
            yield _08_passwordsRecoveryDBRepositury_1.passwordRecoveryRepository
                .deletePasswordData(user._id);
            const passwordData = {
                userId: user._id,
                passwordRecoveryCode: (0, uuid_1.v4)(),
                createdAt: new Date().toISOString(),
                expiredAt: (0, add_1.default)(new Date(), { minutes: 10 }).toISOString(),
            };
            try {
                yield email_manager_1.emailManager.sendRecoveryPasswordCode(user.accountData.email, passwordData.passwordRecoveryCode);
                yield _08_passwordsRecoveryDBRepositury_1.passwordRecoveryRepository
                    .addData(passwordData);
                return true;
            }
            catch (error) {
                return false;
            }
            ;
        });
    },
    updatePassword(newPassword, code) {
        return __awaiter(this, void 0, void 0, function* () {
            const errorMessage = {
                errorsMessages: [{
                        message: 'incorrect recoveryCode',
                        field: 'recoveryCode'
                    }]
            };
            const passwordData = yield _08_passwordsRecoveryDBRepositury_1.passwordRecoveryRepository.getData(code);
            console.log(passwordData);
            if (!passwordData)
                return errorMessage;
            if (new Date(passwordData.expiredAt) < new Date()) {
                yield _08_passwordsRecoveryDBRepositury_1.passwordRecoveryRepository
                    .deletePasswordData(passwordData.userId);
                return errorMessage;
            }
            ;
            const userIsExist = yield _05_usersQueryRepository_1.usersQueryRepository
                .getUserById(passwordData.userId.toString());
            if (!userIsExist)
                return errorMessage;
            const passwordSalt = yield bcrypt_1.default.genSalt(10);
            const passwordHash = yield this
                ._generateHash(newPassword, passwordSalt);
            const setNewPassword = yield _05_usersDbRepository_1.usersRepository
                .updatePassword(passwordData.userId, passwordHash, passwordSalt);
            if (!setNewPassword)
                return errorMessage;
            else
                return true;
        });
    },
    _generateHash(password, salt) {
        return __awaiter(this, void 0, void 0, function* () {
            const hash = yield bcrypt_1.default.hash(password, salt);
            return hash;
        });
    }
};
