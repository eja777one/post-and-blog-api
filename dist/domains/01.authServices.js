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
const email_manager_1 = require("../managers/email-manager");
const _05_usersDbRepository_1 = require("../repositories/05.usersDbRepository");
const _05_usersQueryRepository_1 = require("../repositories/05.usersQueryRepository");
const bson_1 = require("bson");
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const add_1 = __importDefault(require("date-fns/add"));
exports.authServices = {
    checkAuth(loginOrEmail, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield _05_usersQueryRepository_1.usersQueryRepository.getUser(loginOrEmail);
            if (!user)
                return false;
            if (!user.emailConfirmation.isConfirmed)
                return false;
            const inputPass = yield this
                ._generateHash(password, user.accountData.passwordSalt);
            const result = inputPass === user.accountData.passwordHash ? user : false;
            return result;
        });
    },
    confirmEmail(code) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield _05_usersQueryRepository_1.usersQueryRepository.getUserByConfirm(code);
            // console.log(user)
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
            const isUserExist = yield _05_usersQueryRepository_1.usersQueryRepository.getUser(body.email);
            // check user by password
            if (isUserExist)
                return null;
            // console.log(isUserExist)
            const passwordSalt = yield bcrypt_1.default.genSalt(10);
            const passwordHash = yield this
                ._generateHash(body.password, passwordSalt);
            const user = {
                _id: new bson_1.ObjectID,
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
                registrationDataType: { ip }
            };
            const newUserId = yield _05_usersDbRepository_1.usersRepository.addUser(user);
            console.log(newUserId);
            try {
                const mail = yield email_manager_1.emailManager.sendEmailConfirmation(user.accountData.email, user.emailConfirmation.confirmationCode);
                _05_usersDbRepository_1.usersRepository.addConfirmMessage(user._id, mail);
            }
            catch (error) {
                console.error(error);
                yield _05_usersDbRepository_1.usersRepository.deleteUserById(user._id.toString());
                return null;
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
            if (user.emailConfirmation.sentEmails.length > 5)
                return false;
            try {
                const mail = yield email_manager_1.emailManager.sendEmailConfirmation(user.accountData.email, user.emailConfirmation.confirmationCode);
                _05_usersDbRepository_1.usersRepository.addConfirmMessage(user._id, mail);
                return true;
            }
            catch (error) {
                console.error(error);
                return false;
            }
            ;
        });
    },
    _generateHash(password, salt) {
        return __awaiter(this, void 0, void 0, function* () {
            const hash = yield bcrypt_1.default.hash(password, salt);
            return hash;
        });
    }
};
