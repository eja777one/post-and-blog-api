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
            const usersLogs = yield _00_db_1.usersRequestCollection
                .find({ ip: userLog.ip, url: userLog.url })
                .sort({ 'createdAt': -1 })
                .toArray();
            let result;
            if (usersLogs.length < 6) {
                result = yield _00_db_1.usersRequestCollection.insertOne(userLog);
            }
            else {
                yield _00_db_1.usersRequestCollection.deleteOne({
                    ip: userLog.ip,
                    createdAt: usersLogs[4].createdAt
                });
                result = yield _00_db_1.usersRequestCollection.insertOne(userLog);
            }
            return result.insertedId;
        });
    },
    getLogs(userLog) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield _00_db_1.usersRequestCollection
                .find({ ip: userLog.ip, url: userLog.url })
                .sort({ 'createdAt': -1 })
                .toArray();
            return result;
        });
    },
    deleteLogs(userLog) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield _00_db_1.usersRequestCollection
                .deleteMany({ ip: userLog.ip, url: userLog.url });
            return result;
        });
    },
    deleteAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield _00_db_1.usersRequestCollection.deleteMany({});
            return result.deletedCount;
        });
    }
};
