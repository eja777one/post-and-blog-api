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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtService = void 0;
const mongodb_1 = require("mongodb");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const settings_1 = require("./settings");
exports.jwtService = {
    createAccessJwt(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return jsonwebtoken_1.default.sign({ userId }, settings_1.settings.ACCESS_JWT_SECRET, { expiresIn: '10s' });
        });
    },
    createRefreshJwt(userId, deviceId, createdAt) {
        return __awaiter(this, void 0, void 0, function* () {
            return jsonwebtoken_1.default.sign({ userId, deviceId, createdAt }, settings_1.settings.REFRESH_JWT_SECRET, { expiresIn: '20s' });
        });
    },
    getUserIdByToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = jsonwebtoken_1.default.
                    verify(token, settings_1.settings.ACCESS_JWT_SECRET);
                return new mongodb_1.ObjectId(result.userId);
            }
            catch (error) {
                return null;
            }
            ;
        });
    },
    getPayloadRefToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = jsonwebtoken_1.default.verify(token, settings_1.settings.REFRESH_JWT_SECRET);
                return {
                    userId: result.userId,
                    deviceId: result.deviceId,
                    createdAt: result.createdAt
                };
            }
            catch (error) {
                return null;
            }
            ;
        });
    },
    getExpiredPayloadRefToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = jsonwebtoken_1.default.verify(token, settings_1.settings.REFRESH_JWT_SECRET, { ignoreExpiration: true });
                return {
                    userId: result.userId,
                    deviceId: result.deviceId,
                    createdAt: result.createdAt
                };
            }
            catch (error) {
                return null;
            }
            ;
        });
    },
};
