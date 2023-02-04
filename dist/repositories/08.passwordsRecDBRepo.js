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
exports.PasswordRecoveryRepository = void 0;
const _00_db_1 = require("./00.db");
class PasswordRecoveryRepository {
    addData(passwordData) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield _00_db_1.PasswordsRecoveryModel
                .collection.insertOne(passwordData);
            return true;
        });
    }
    getData(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield _00_db_1.PasswordsRecoveryModel.collection
                .findOne({ passwordRecoveryCode: code });
            return result;
        });
    }
    getCode(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield _00_db_1.PasswordsRecoveryModel.collection.findOne({ userId });
            return result;
        });
    }
    deletePasswordData(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield _00_db_1.PasswordsRecoveryModel.deleteOne({ userId });
            return true;
        });
    }
    deleteAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield _00_db_1.PasswordsRecoveryModel.deleteMany({});
            return true;
        });
    }
}
exports.PasswordRecoveryRepository = PasswordRecoveryRepository;
;
