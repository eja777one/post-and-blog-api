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
exports.UsersService = void 0;
const inversify_1 = require("inversify");
const _05_usersQRepo_1 = require("./../repositories/05.usersQRepo");
const _05_usersDBRepo_1 = require("./../repositories/05.usersDBRepo");
const models_1 = require("../models");
const bson_1 = require("bson");
const bcrypt_1 = __importDefault(require("bcrypt"));
const add_1 = __importDefault(require("date-fns/add"));
let UsersService = class UsersService {
    constructor(usersRepository, usersQueryRepository) {
        this.usersRepository = usersRepository;
        this.usersQueryRepository = usersQueryRepository;
    }
    getUsers(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield this.usersQueryRepository.getUsers(query);
            return new models_1.BLLResponse(200, users);
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
            if (!user)
                return new models_1.BLLResponse(404);
            else
                return new models_1.BLLResponse(201, user);
        });
    }
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleted = yield this.usersRepository.deleteUser(id);
            if (!deleted)
                return new models_1.BLLResponse(404);
            else
                return new models_1.BLLResponse(204);
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
};
UsersService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(_05_usersDBRepo_1.UsersRepository)),
    __param(1, (0, inversify_1.inject)(_05_usersQRepo_1.UsersQueryRepository)),
    __metadata("design:paramtypes", [_05_usersDBRepo_1.UsersRepository,
        _05_usersQRepo_1.UsersQueryRepository])
], UsersService);
exports.UsersService = UsersService;
;
