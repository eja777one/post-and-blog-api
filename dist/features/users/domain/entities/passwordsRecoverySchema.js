"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordsRecoverySchema = void 0;
const bson_1 = require("bson");
const mongoose_1 = require("mongoose");
const db_1 = require("../../../../db");
const uuid_1 = require("uuid");
const add_1 = __importDefault(require("date-fns/add"));
;
exports.passwordsRecoverySchema = new mongoose_1.Schema({
    userId: { type: bson_1.ObjectID, required: true },
    passwordRecoveryCode: { type: String, required: true },
    createdAt: { type: String, required: true },
    expiredAt: { type: String, required: true },
});
exports.passwordsRecoverySchema.static('makePasswordData', function makePasswordData(userId) {
    return new db_1.PasswordsRecoveryModel({
        userId: userId,
        passwordRecoveryCode: (0, uuid_1.v4)(),
        createdAt: new Date().toISOString(),
        expiredAt: (0, add_1.default)(new Date(), { minutes: 10 }).toISOString(),
    });
});
