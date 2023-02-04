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
exports.UsersService = void 0;
const _05_usersQRepo_1 = require("./../repositories/05.usersQRepo");
const _05_usersDBRepo_1 = require("./../repositories/05.usersDBRepo");
const models_1 = require("../models");
const bson_1 = require("bson");
const bcrypt_1 = __importDefault(require("bcrypt"));
const add_1 = __importDefault(require("date-fns/add"));
class UsersService {
    constructor() {
        this.usersRepository = new _05_usersDBRepo_1.UsersRepository();
        this.usersQueryRepository = new _05_usersQRepo_1.UsersQueryRepository();
    }
    getUsers(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield this.usersQueryRepository.getUsers(query);
            return users;
        });
    }
    createUser(body, ip) {
        return __awaiter(this, void 0, void 0, function* () {
            const passwordSalt = yield bcrypt_1.default.genSalt(10);
            const passwordHash = yield this._generateHash(body.password, passwordSalt);
            const userInput = new models_1.UserDBModel(new bson_1.ObjectID, {
                login: body.login,
                email: body.email,
                passwordHash,
                passwordSalt,
                createdAt: new Date().toISOString(),
            }, {
                confirmationCode: 'none',
                expirationDate: (0, add_1.default)(new Date(), { hours: 0 }),
                isConfirmed: true,
                sentEmails: []
            }, { ip });
            const newUserId = yield this.usersRepository.addUser(userInput);
            const user = yield this.usersQueryRepository.getUser(newUserId);
            return user;
        });
    }
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleted = yield this.usersRepository.deleteUser(id);
            return deleted;
        });
    }
    deleteAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.usersRepository.deleteAll();
            return result;
        });
    }
    _generateHash(password, salt) {
        return __awaiter(this, void 0, void 0, function* () {
            const hash = yield bcrypt_1.default.hash(password, salt);
            return hash;
        });
    }
}
exports.UsersService = UsersService;
;
