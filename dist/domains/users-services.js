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
const users_db_repository_1 = require("./../repositories/users-db-repository");
const users_query_repository_1 = require("../repositories/users-query-repository");
const bson_1 = require("bson");
const bcrypt_1 = __importDefault(require("bcrypt"));
exports.usersServices = {
    checkAuth(login, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_query_repository_1.usersQueryRepository.getUserByLogin(login);
            if (user) {
                const inputPass = yield this
                    ._generateHash(password, user.passwordSalt);
                const result = inputPass === user.passwordHash ? user : false;
                return result;
            }
            else
                return false;
        });
    },
    createUser(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const passwordSalt = yield bcrypt_1.default.genSalt(10);
            const passwordHash = yield this
                ._generateHash(body.password, passwordSalt);
            const user = {
                _id: new bson_1.ObjectID,
                login: body.login,
                email: body.email,
                createdAt: new Date().toISOString(),
                passwordHash,
                passwordSalt
            };
            const newUser = yield users_db_repository_1.usersRepository.addUser(user);
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
            const result = yield users_db_repository_1.usersRepository.deleteUserById(id);
            return result;
        });
    },
    deleteAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield users_db_repository_1.usersRepository.deleteAll();
        });
    }
};
