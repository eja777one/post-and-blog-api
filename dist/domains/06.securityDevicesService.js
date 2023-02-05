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
exports.SecurityDevicesService = void 0;
const jwt_service_1 = require("../application/jwt-service");
class SecurityDevicesService {
    constructor(tokensMetaRepository, tokensQueryMetaRepository) {
        this.tokensMetaRepository = tokensMetaRepository;
        this.tokensQueryMetaRepository = tokensQueryMetaRepository;
    }
    getUsersSessions(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = yield jwt_service_1.jwtService.getPayloadRefToken(refreshToken);
            if (!payload)
                return null;
            const sessions = yield this.tokensQueryMetaRepository
                .getUsersSessions(payload.userId);
            if (!sessions)
                return null;
            return sessions;
        });
    }
    deleteOtherSessions(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = yield jwt_service_1.jwtService.getPayloadRefToken(refreshToken);
            if (!payload)
                return false;
            const deletedSessions = yield this.tokensMetaRepository
                .deleteOtherSessions(payload.userId, payload.deviceId);
            return deletedSessions;
        });
    }
    deleteThisSession(refreshToken, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = yield jwt_service_1.jwtService.getPayloadRefToken(refreshToken);
            if (!payload)
                return 'UNAUTHORIZED_401';
            const getSession = yield this.tokensQueryMetaRepository
                .getSessionByDeviceId(deviceId);
            if (!getSession)
                return 'NOT_FOUND_404';
            if (getSession.userId !== payload.userId)
                return 'FORBIDDEN_403';
            const deleteThisSessions = yield this.tokensMetaRepository
                .deleteThisSessions(payload.userId, deviceId);
            return deleteThisSessions ? 'NO_CONTENT_204' : 'NOT_FOUND_404';
        });
    }
}
exports.SecurityDevicesService = SecurityDevicesService;
;
