"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersQueryRepository = void 0;
require("reflect-metadata");
const bson_1 = require("bson");
const mongodb_1 = require("mongodb");
const db_1 = require("../../../db");
const inversify_1 = require("inversify");
const prepareUser = (input) => {
    return {
        id: input._id.toString(),
        login: input.accountData.login,
        email: input.accountData.email,
        createdAt: input.accountData.createdAt
    };
};
let UsersQueryRepository = class UsersQueryRepository {
    getUsers(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const sortBy = query.sortBy;
            const sortDirection = query.sortDirection === 'asc' ? 1 : -1;
            const sortObj = {};
            sortObj[sortBy] = sortDirection;
            let findObj = { $or: [] };
            if (query.searchLoginTerm) {
                findObj.$or.push({ login: new RegExp(query.searchLoginTerm, 'i') });
            }
            ;
            if (query.searchEmailTerm) {
                findObj.$or.push({ email: new RegExp(query.searchEmailTerm, 'i') });
            }
            ;
            if (findObj.$or.length === 0)
                findObj = {};
            const items = yield db_1.UserModel.find(findObj)
                .sort(sortObj)
                .limit(query.pageSize)
                .skip((query.pageNumber - 1) * query.pageSize)
                .lean();
            const usersCount = yield db_1.UserModel.countDocuments(findObj);
            const pagesCount = Math.ceil(usersCount / query.pageSize);
            return {
                pagesCount,
                page: query.pageNumber,
                pageSize: query.pageSize,
                totalCount: usersCount,
                items: items.map((el) => prepareUser(el))
            };
        });
    }
    getUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield db_1.UserModel.findOne({ _id: new bson_1.ObjectID(id) });
            return user ? prepareUser(user) : null;
        });
    }
    getDBUser(param) {
        return __awaiter(this, void 0, void 0, function* () {
            if (mongodb_1.ObjectId.isValid(param)) {
                const user = yield db_1.UserModel.findOne({ _id: new bson_1.ObjectID(param) });
                return user ? user : null;
            }
            else if (param.indexOf('@') !== -1) {
                const user = yield db_1.UserModel.findOne({ 'accountData.email': param });
                return user ? user : null;
            }
            else {
                const user = yield db_1.UserModel.findOne({ 'accountData.login': param });
                return user ? user : null;
            }
            ;
        });
    }
    findUser(loginOrEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            if (loginOrEmail.indexOf('@') !== -1) {
                const user = yield db_1.UserModel.
                    findOne({ 'accountData.email': loginOrEmail });
                return user ? 'emailIsExist' : null;
            }
            else {
                const user = yield db_1.UserModel
                    .findOne({ 'accountData.login': loginOrEmail });
                return user ? 'loginIsExist' : null;
            }
            ;
        });
    }
    getUserByConfirm(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield db_1.UserModel.findOne({
                'emailConfirmation.confirmationCode': code
            });
            return user;
        });
    }
    getUserForTests(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield db_1.UserModel.findOne({ 'accountData.email': email });
            if (!user)
                return null;
            return {
                _id: user === null || user === void 0 ? void 0 : user._id,
                login: user === null || user === void 0 ? void 0 : user.accountData.login,
                email: user === null || user === void 0 ? void 0 : user.accountData.email,
                createdAt: user === null || user === void 0 ? void 0 : user.accountData.createdAt,
                confirmationCode: user === null || user === void 0 ? void 0 : user.emailConfirmation.confirmationCode,
                expirationDate: user === null || user === void 0 ? void 0 : user.emailConfirmation.expirationDate,
                isConfirmed: user === null || user === void 0 ? void 0 : user.emailConfirmation.isConfirmed,
                sentEmailsCount: user === null || user === void 0 ? void 0 : user.emailConfirmation.sentEmails.length
            };
        });
    }
};
UsersQueryRepository = __decorate([
    (0, inversify_1.injectable)()
], UsersQueryRepository);
exports.UsersQueryRepository = UsersQueryRepository;
;
