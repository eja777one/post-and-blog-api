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
exports.usersRepository = void 0;
const bson_1 = require("bson");
const _00_db_1 = require("./00.db");
exports.usersRepository = {
    addUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield _00_db_1.usersCollection.insertOne(user);
            return result.insertedId.toString();
        });
    },
    deleteUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield _00_db_1.usersCollection.deleteOne({ _id: new bson_1.ObjectID(id) });
            return result.deletedCount === 1;
        });
    },
    activateUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield _00_db_1.usersCollection.updateOne({ _id: id }, { $set: { 'emailConfirmation.isConfirmed': true } });
            return result.matchedCount;
        });
    },
    updateConfirmation(id, mail, code, date) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield _00_db_1.usersCollection.updateOne({ _id: id }, {
                $push: { 'emailConfirmation.sentEmails': mail },
                $set: {
                    'emailConfirmation.confirmationCode': code,
                    'emailConfirmation.expirationDate': date,
                }
            });
            return result.matchedCount;
        });
    },
    addConfirmMessage(id, mail) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield _00_db_1.usersCollection.updateOne({ _id: id }, {
                $push: { 'emailConfirmation.sentEmails': mail }
            });
            return result.matchedCount;
        });
    },
    deleteAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield _00_db_1.usersCollection.deleteMany({});
            return result.deletedCount;
        });
    }
};
