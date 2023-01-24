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
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersQueryRepository = void 0;
const _00_db_1 = require("./00.db");
const bson_1 = require("bson");
const prepareUser = (input) => {
    const obj = {
        id: input._id.toString(),
        login: input.accountData.login,
        email: input.accountData.email,
        createdAt: input.accountData.createdAt
    };
    return obj;
};
exports.usersQueryRepository = {
    getUsersByQuery(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (query.pageNumber - 1) * query.pageSize;
            const limit = query.pageSize;
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
            const items = yield _00_db_1.usersCollection.find(findObj)
                .sort(sortObj)
                .limit(limit)
                .skip(skip)
                .toArray();
            const usersCount = yield _00_db_1.usersCollection.countDocuments(findObj);
            const pagesCount = Math.ceil(usersCount / limit);
            return {
                pagesCount,
                page: query.pageNumber,
                pageSize: query.pageSize,
                totalCount: usersCount,
                items: items.map((el) => prepareUser(el))
            };
        });
    },
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield _00_db_1.usersCollection.findOne({ _id: new bson_1.ObjectID(id) });
            if (user)
                return prepareUser(user);
            else
                return null;
        });
    },
    getDbUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield _00_db_1.usersCollection.findOne({ _id: new bson_1.ObjectID(id) });
            if (user)
                return user;
            else
                return null;
        });
    },
    getDbUser(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield _00_db_1.usersCollection.findOne({ 'accountData.email': email });
            const formatUser = {
                _id: user === null || user === void 0 ? void 0 : user._id,
                login: user === null || user === void 0 ? void 0 : user.accountData.login,
                email: user === null || user === void 0 ? void 0 : user.accountData.email,
                createdAt: user === null || user === void 0 ? void 0 : user.accountData.createdAt,
                confirmationCode: user === null || user === void 0 ? void 0 : user.emailConfirmation.confirmationCode,
                expirationDate: user === null || user === void 0 ? void 0 : user.emailConfirmation.expirationDate,
                isConfirmed: user === null || user === void 0 ? void 0 : user.emailConfirmation.isConfirmed,
                sentEmailsCount: user === null || user === void 0 ? void 0 : user.emailConfirmation.sentEmails.length
            };
            if (user)
                return formatUser;
            else
                return null;
        });
    },
    getUser(loginOrEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            let user;
            if (loginOrEmail.indexOf('@') !== -1) {
                user = yield _00_db_1.usersCollection.
                    findOne({ 'accountData.email': loginOrEmail });
            }
            else {
                user = yield _00_db_1.usersCollection
                    .findOne({ 'accountData.login': loginOrEmail });
            }
            ;
            return user;
        });
    },
    getUserByConfirm(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield _00_db_1.usersCollection.findOne({
                'emailConfirmation.confirmationCode': code
            });
            return user;
        });
    },
    getUserByRefreshToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield _00_db_1.usersCollection.findOne({
                'loginData.refreshToken': refreshToken
            });
            return user;
        });
    },
};
