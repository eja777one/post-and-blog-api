"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = void 0;
const db_1 = require("./../../../../db");
const mongoose_1 = __importDefault(require("mongoose"));
const add_1 = __importDefault(require("date-fns/add"));
const uuid_1 = require("uuid");
;
;
exports.userSchema = new mongoose_1.default.Schema({
    accountData: {
        login: { type: String, required: true },
        email: { type: String, required: true },
        passwordHash: { type: String, required: true },
        passwordSalt: { type: String, required: true },
        createdAt: { type: String, required: true }
    },
    emailConfirmation: {
        confirmationCode: { type: String, required: true },
        expirationDate: { type: Date, required: true },
        isConfirmed: { type: Boolean, required: true },
        sentEmails: [
            { sentDate: { type: Date, required: true } }
        ]
    },
    registrationDataType: {
        ip: { type: String }
    }
});
exports.userSchema.static('makeUserByAdmin', function makeUserByAdmin(login, email, passwordHash, passwordSalt, ip) {
    return new db_1.UserModel({
        accountData: {
            login: login,
            email: email,
            passwordHash,
            passwordSalt,
            createdAt: new Date().toISOString(),
        },
        emailConfirmation: {
            confirmationCode: 'none',
            expirationDate: (0, add_1.default)(new Date(), { hours: 0 }),
            isConfirmed: true,
            sentEmails: []
        },
        registrationDataType: { ip }
    });
});
exports.userSchema.static('makeUser', function makeUser(login, email, passwordHash, passwordSalt, ip) {
    return new db_1.UserModel({
        accountData: {
            login: login,
            email: email,
            passwordHash,
            passwordSalt,
            createdAt: new Date().toISOString(),
        },
        emailConfirmation: {
            confirmationCode: (0, uuid_1.v4)(),
            expirationDate: (0, add_1.default)(new Date(), { hours: 24 }),
            isConfirmed: false,
            sentEmails: [{ sentDate: new Date() }]
        },
        registrationDataType: { ip }
    });
});
exports.userSchema.method('updateConfirmation', function updateConfirmation(newConfirmationCode) {
    this.emailConfirmation.confirmationCode = newConfirmationCode;
    this.emailConfirmation.expirationDate = (0, add_1.default)(new Date(), { hours: 24 });
    this.emailConfirmation.sentEmails.push({ sentDate: new Date() });
});
exports.userSchema.method('activateUser', function activateUser() {
    this.emailConfirmation.isConfirmed = true;
});
exports.userSchema.method('updatePassword', function updatePassword(passwordHash, passwordSalt) {
    this.accountData.passwordHash = passwordHash;
    this.accountData.passwordSalt = passwordSalt;
});
