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
exports.usersRequestRepository = void 0;
const _00_db_1 = require("./00.db");
exports.usersRequestRepository = {
    addLog(userLog) {
        return __awaiter(this, void 0, void 0, function* () {
            const usersLogs = yield _00_db_1.UsersRequestModel
                .create({
                _id: userLog._id,
                ip: userLog.ip,
                url: userLog.url,
                createdAt: userLog.createdAt
            });
            return usersLogs;
        });
    },
    getLogs(userLog, attemmptTime) {
        return __awaiter(this, void 0, void 0, function* () {
            // const isoDate = userLog.createdAt.toISOString();
            const isoDate = attemmptTime.toISOString();
            console.log(userLog.createdAt, 'isoDate');
            const result = yield _00_db_1.UsersRequestModel.countDocuments({
                ip: { $regex: userLog.ip },
                url: { $regex: userLog.url },
                createdAt: { $gt: isoDate }
                // createdAt: { $gt: userLog.createdAt }
            });
            // const result = await UsersRequestModel.find({
            //   ip: { $regex: userLog.ip },
            //   url: { $regex: userLog.url },
            //   // createdAt: { $gt: isoDate }
            //   // createdAt: { $gt: userLog.createdAt }
            // });
            // const len = result.filter(el => el.createdAt.getTime() < userLog.createdAt.getTime());
            // console.log(len.length)
            console.log(result);
            return result;
        });
    },
    getData() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield _00_db_1.UsersRequestModel.find({}).lean();
            return result;
        });
    },
    deleteLogs(userLog) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield _00_db_1.UsersRequestModel
                .deleteMany({ ip: userLog.ip, url: userLog.url });
            return result;
        });
    },
    deleteAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield _00_db_1.UsersRequestModel.deleteMany({});
            return result.deletedCount;
        });
    }
};
