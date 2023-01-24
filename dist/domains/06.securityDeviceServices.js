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
exports.securityDeviceServices = void 0;
const _06_tokensDBRepository_1 = require("./../repositories/06.tokensDBRepository");
const jwt_service_1 = require("../application/jwt-service");
exports.securityDeviceServices = {
    getUsersSessions(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = yield jwt_service_1.jwtService.
                getPayloadRefToken(refreshToken);
            if (!payload)
                return null;
            const sessions = yield _06_tokensDBRepository_1.tokensMetaRepository
                .getUsersSessions(payload.userId);
            if (!sessions)
                return null;
            return sessions;
        });
    },
    deleteOtherSessions(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = yield jwt_service_1.jwtService.
                getPayloadRefToken(refreshToken);
            if (!payload)
                return false;
            const deletedSessions = yield _06_tokensDBRepository_1.tokensMetaRepository
                .deleteOtherSessions(payload.userId, payload.deviceId);
            return deletedSessions >= 0;
        });
    },
    deleteThisSession(refreshToken, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = yield jwt_service_1.jwtService.
                getPayloadRefToken(refreshToken);
            if (!payload)
                return '401';
            const getSession = yield _06_tokensDBRepository_1.tokensMetaRepository
                .getSessionByDeviceId(deviceId);
            if (!getSession)
                return '404';
            if (getSession.userId !== payload.userId)
                return '403';
            const deleteThisSessions = yield _06_tokensDBRepository_1.tokensMetaRepository
                .deleteThisSessions(payload.userId, deviceId);
            return deleteThisSessions === 1 ? '204' : '404';
        });
    },
};
