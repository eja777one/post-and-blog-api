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
exports.UsersRequestRepository = void 0;
const _00_db_1 = require("./00.db");
class UsersRequestRepository {
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
    }
    getLogs(userLog, attemmptTime) {
        return __awaiter(this, void 0, void 0, function* () {
            const isoDate = attemmptTime.toISOString();
            const result = yield _00_db_1.UsersRequestModel.countDocuments({
                ip: { $regex: userLog.ip },
                url: { $regex: userLog.url },
                createdAt: { $gt: isoDate }
            });
            return result;
        });
    }
    deleteAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield _00_db_1.UsersRequestModel.deleteMany({});
            return result.deletedCount;
        });
    }
}
exports.UsersRequestRepository = UsersRequestRepository;
;