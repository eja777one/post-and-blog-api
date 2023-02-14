"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokensMetaSchema = void 0;
const db_1 = require("./../../../../db");
const mongoose_1 = require("mongoose");
const add_1 = __importDefault(require("date-fns/add"));
;
exports.tokensMetaSchema = new mongoose_1.Schema({
    createdAt: { type: String, required: true },
    expiredAt: { type: String, required: true },
    deviceId: { type: String, required: true },
    ip: { type: String, required: true },
    deviceName: { type: String, required: true },
    userId: { type: String, required: true }
});
exports.tokensMetaSchema.static('makeSession', function makeSession(createdAt, deviceId, ip, deviceName, userId) {
    return new db_1.tokensMetaModel({
        createdAt: createdAt,
        expiredAt: (0, add_1.default)(new Date(), { minutes: 60 }).toISOString(),
        deviceId: deviceId,
        ip: ip,
        deviceName: deviceName,
        userId: userId
    });
});
exports.tokensMetaSchema.method('updateSession', function updateSession(createdAt) {
    this.createdAt = createdAt;
    this.expiredAt = (0, add_1.default)(new Date(), { minutes: 60 }).toISOString();
});
