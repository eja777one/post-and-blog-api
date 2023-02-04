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
exports.UsersQueryRepository = void 0;
const bson_1 = require("bson");
const mongodb_1 = require("mongodb");
const _00_db_1 = require("./00.db");
const prepareUser = (input) => {
    return {
        id: input._id.toString(),
        login: input.accountData.login,
        email: input.accountData.email,
        createdAt: input.accountData.createdAt
    };
};
class UsersQueryRepository {
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
            const items = yield _00_db_1.UserModel.find(findObj)
                .sort(sortObj)
                .limit(query.pageSize)
                .skip((query.pageNumber - 1) * query.pageSize)
                .lean();
            const usersCount = yield _00_db_1.UserModel.countDocuments(findObj);
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
            const user = yield _00_db_1.UserModel.findOne({ _id: new bson_1.ObjectID(id) });
            return user ? prepareUser(user) : null;
        });
    }
    getDBUser(param) {
        return __awaiter(this, void 0, void 0, function* () {
            let user;
            if (mongodb_1.ObjectId.isValid(param)) {
                user = yield _00_db_1.UserModel.findOne({ _id: new bson_1.ObjectID(param) });
            }
            else if (param.indexOf('@') !== -1) {
                user = yield _00_db_1.UserModel.findOne({ 'accountData.email': param });
            }
            else {
                user = yield _00_db_1.UserModel.findOne({ 'accountData.login': param });
            }
            ;
            return user ? user : null;
        });
    }
    findUser(loginOrEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            if (loginOrEmail.indexOf('@') !== -1) {
                const user = yield _00_db_1.UserModel.
                    findOne({ 'accountData.email': loginOrEmail });
                return user ? 'emailIsExist' : null;
            }
            else {
                const user = yield _00_db_1.UserModel
                    .findOne({ 'accountData.login': loginOrEmail });
                return user ? 'loginIsExist' : null;
            }
            ;
        });
    }
    getUserByConfirm(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield _00_db_1.UserModel.findOne({
                'emailConfirmation.confirmationCode': code
            });
            return user;
        });
    }
    getUserForTests(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield _00_db_1.UserModel.findOne({ 'accountData.email': email });
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
}
exports.UsersQueryRepository = UsersQueryRepository;
;
