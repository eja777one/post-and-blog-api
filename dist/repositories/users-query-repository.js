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
const db_1 = require("./db");
const bson_1 = require("bson");
const prepareUser = (input) => {
    const obj = {
        id: input._id.toString(),
        login: input.login,
        email: input.email,
        createdAt: input.createdAt
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
            const findObj = {};
            query.searchLoginTerm ? findObj.login = new RegExp(query.searchLoginTerm, 'i') : '';
            query.searchEmailTerm ? findObj.email = new RegExp(query.searchEmailTerm, 'i') : '';
            const items = yield db_1.usersCollection.find(findObj)
                .sort(sortObj)
                .limit(limit)
                .skip(skip)
                .toArray();
            const items2 = yield db_1.usersCollection.find(findObj).toArray();
            const pagesCount = Math.ceil(items2.length / limit);
            const answer = {
                pagesCount,
                page: query.pageNumber,
                pageSize: query.pageSize,
                totalCount: items2.length,
                items: items.map((el) => prepareUser(el))
            };
            return answer;
        });
    },
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield db_1.usersCollection.findOne({ _id: new bson_1.ObjectID(id) });
            return prepareUser(user);
        });
    },
    getUserByLogin(login) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield db_1.usersCollection.findOne({ login });
            return user;
        });
    },
    getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.usersCollection.find({}).toArray();
            return result;
        });
    },
};
