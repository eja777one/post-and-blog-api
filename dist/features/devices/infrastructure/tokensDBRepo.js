"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
exports.TokensMetaRepository = void 0;
const inversify_1 = require("inversify");
const db_1 = require("../../../db");
let TokensMetaRepository = class TokensMetaRepository {
    save(model) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = model.save();
            return result._id;
        });
    }
    // async addSession(sessionData: TokensMetaDBModel) {
    //   const result = await tokensMetaModel.collection.insertOne(sessionData);
    //   return result.insertedId.toString();
    // }
    // async updateSession(previousCreatedAt: string, createdAt: string,
    //   expiredAt: string) {
    //   const result = await tokensMetaModel.updateOne(
    //     { createdAt: previousCreatedAt },
    //     { $set: { createdAt, expiredAt } }
    //   );
    //   return result.matchedCount === 1;
    // }
    deleteSessionBeforeLogin(ip, deviceName, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.tokensMetaModel.deleteOne({ userId, ip, deviceName });
            return result.deletedCount;
        });
    }
    deleteSessionBeforeLogout(userId, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.tokensMetaModel.deleteOne({ userId, deviceId });
            return result.deletedCount === 1;
        });
    }
    deleteOtherSessions(userId, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.tokensMetaModel
                .deleteMany({ userId, deviceId: { $ne: deviceId } });
            return result.deletedCount >= 0;
        });
    }
    deleteThisSessions(userId, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.tokensMetaModel.deleteOne({ userId, deviceId });
            return result.deletedCount === 1;
        });
    }
    deleteAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.tokensMetaModel.deleteMany({});
            return result.deletedCount;
        });
    }
};
TokensMetaRepository = __decorate([
    (0, inversify_1.injectable)()
], TokensMetaRepository);
exports.TokensMetaRepository = TokensMetaRepository;
;
