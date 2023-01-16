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
exports.usersServices = void 0;
const _05_usersDbRepository_1 = require("../repositories/05.usersDbRepository");
const bson_1 = require("bson");
const bcrypt_1 = __importDefault(require("bcrypt"));
const add_1 = __importDefault(require("date-fns/add"));
exports.usersServices = {
    createUser(body, ip) {
        return __awaiter(this, void 0, void 0, function* () {
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
                    confirmationCode: 'none',
                    expirationDate: (0, add_1.default)(new Date(), { hours: 0 }),
                    isConfirmed: true,
                    sentEmails: []
                },
                registrationDataType: { ip }
            };
            const newUser = yield _05_usersDbRepository_1.usersRepository.addUser(user);
            return newUser;
        });
    },
    _generateHash(password, salt) {
        return __awaiter(this, void 0, void 0, function* () {
            const hash = yield bcrypt_1.default.hash(password, salt);
            return hash;
        });
    },
    deleteUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield _05_usersDbRepository_1.usersRepository.deleteUserById(id);
            return result;
        });
    },
    deleteAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield _05_usersDbRepository_1.usersRepository.deleteAll();
        });
    }
};
