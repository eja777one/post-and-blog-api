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
exports.tokensQueryMetaRepository = void 0;
const _00_db_1 = require("./00.db");
class TokensQueryMetaRepository {
    getSessionByDeviceId(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield _00_db_1.tokensMetaModel.findOne({ deviceId });
            return result;
        });
    }
    getUsersSessions(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield _00_db_1.tokensMetaModel.find({ userId }).lean();
            if (!result)
                return null;
            let answer = [];
            for (let el of result) {
                answer.push({
                    ip: el.ip,
                    title: el.deviceName,
                    lastActiveDate: el.createdAt,
                    deviceId: el.deviceId
                });
            }
            ;
            return answer;
        });
    }
    getTokenMeta(userId, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield _00_db_1.tokensMetaModel.findOne({ userId, deviceId });
            return result === null || result === void 0 ? void 0 : result.createdAt;
        });
    }
    checkSession(ip, deviceName, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield _00_db_1.tokensMetaModel.findOne({ userId, ip, deviceName });
            return result;
        });
    }
}
;
exports.tokensQueryMetaRepository = new TokensQueryMetaRepository();
