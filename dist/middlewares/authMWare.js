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
exports.addOptionalUserInfo = exports.authMware = void 0;
const jwt_service_1 = require("../application/jwt-service");
const models_1 = require("../models");
const _05_usersQRepo_1 = require("../repositories/05.usersQRepo");
const usersQueryRepository = new _05_usersQRepo_1.UsersQueryRepository();
const authMware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.headers.authorization) {
        return res.sendStatus(models_1.HTTP.UNAUTHORIZED_401);
    }
    ;
    const token = req.headers.authorization.split(' ')[1];
    const userId = yield jwt_service_1.jwtService.getUserIdByToken(token);
    if (!userId)
        return res.sendStatus(models_1.HTTP.UNAUTHORIZED_401);
    const user = yield usersQueryRepository.getUser(userId.toString());
    if (!user)
        return res.sendStatus(models_1.HTTP.UNAUTHORIZED_401);
    req.user = user;
    next();
});
exports.authMware = authMware;
const addOptionalUserInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.headers.authorization)
        return next();
    const token = req.headers.authorization.split(' ')[1];
    const userId = yield jwt_service_1.jwtService.getUserIdByToken(token);
    if (!userId)
        return next();
    const user = yield usersQueryRepository.getUser(userId.toString());
    if (!user)
        return next();
    req.user = user;
    next();
});
exports.addOptionalUserInfo = addOptionalUserInfo;
