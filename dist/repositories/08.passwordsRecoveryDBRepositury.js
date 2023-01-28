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
exports.passwordRecoveryRepository = void 0;
const _00_db_1 = require("./00.db");
exports.passwordRecoveryRepository = {
    addCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield _00_db_1.PasswordsRecoveryModel.collection.insertOne({ code });
            return true;
        });
    },
    getCode() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield _00_db_1.PasswordsRecoveryModel.find({});
            return result[0];
        });
    },
    deleteCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield _00_db_1.PasswordsRecoveryModel.deleteOne({ code });
            return result.deletedCount === 1;
        });
    },
    deleteAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield _00_db_1.PasswordsRecoveryModel.deleteMany({});
            return true;
        });
    }
};
