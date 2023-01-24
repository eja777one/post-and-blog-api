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
exports.tokensMetaRepository = void 0;
const _00_db_1 = require("./00.db");
exports.tokensMetaRepository = {
    addSession(sessionData) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield _00_db_1.tokensMetaCollection
                .insertOne(sessionData);
            return result.insertedId.toString();
        });
    },
    updateSession(previousCreatedAt, createdAt, expiredAt) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield _00_db_1.tokensMetaCollection.updateOne({ createdAt: previousCreatedAt }, { $set: { createdAt, expiredAt } });
            return result.matchedCount;
        });
    },
    deleteSessionBeforeLogin(ip, deviceName, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield _00_db_1.tokensMetaCollection
                .deleteOne({ userId, ip, deviceName });
            return result.deletedCount;
        });
    },
    deleteSessionBeforeLogout(userId, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield _00_db_1.tokensMetaCollection
                .deleteOne({ userId, deviceId });
            return result.deletedCount;
        });
    },
    getUsersSessions(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield _00_db_1.tokensMetaCollection
                .find({ userId }).toArray();
            let answer = [];
            if (result) {
                result.map(session => {
                    answer.push({
                        ip: session.ip,
                        title: session.deviceName,
                        lastActiveDate: session.createdAt,
                        deviceId: session.deviceId
                    });
                });
                return answer;
            }
            else
                return null;
        });
    },
    deleteOtherSessions(userId, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield _00_db_1.tokensMetaCollection
                .deleteMany({ userId, deviceId: { $ne: deviceId } });
            return result.deletedCount;
        });
    },
    deleteThisSessions(userId, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield _00_db_1.tokensMetaCollection
                .deleteOne({ userId, deviceId });
            return result.deletedCount;
        });
    },
    getSessionByDeviceId(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield _00_db_1.tokensMetaCollection
                .findOne({ deviceId });
            return result;
        });
    },
    deleteAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield _00_db_1.tokensMetaCollection
                .deleteMany({});
            return result.deletedCount;
        });
    }
};
