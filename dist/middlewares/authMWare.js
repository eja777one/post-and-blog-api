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
exports.authMware = void 0;
const models_1 = require("../models");
const users_query_repository_1 = require("../repositories/users-query-repository");
const jwt_service_1 = require("../application/jwt-service");
const authMware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.headers.authorization) {
        res.sendStatus(models_1.HTTP.UNAUTHORIZED_401); // TEST #3.17
        return;
    }
    ;
    const token = req.headers.authorization.split(' ')[1];
    const userId = yield jwt_service_1.jwtService.getUserIdByToken(token);
    if (userId) {
        req.user = yield users_query_repository_1.usersQueryRepository.getUserById(userId.toString());
        next();
    }
    else {
        res.sendStatus(models_1.HTTP.UNAUTHORIZED_401); // TEST #5.3, #5.10
        return;
    }
    ;
});
exports.authMware = authMware;
