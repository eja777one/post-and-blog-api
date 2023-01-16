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
exports.usersRouter = void 0;
const express_1 = require("express");
const checkAuthMware_1 = require("../middlewares/checkAuthMware");
const checkReqBodyMware_1 = require("../middlewares/checkReqBodyMware");
const checkParamMware_1 = require("../middlewares/checkParamMware");
const _05_usersQueryRepository_1 = require("../repositories/05.usersQueryRepository");
const _05_usersServices_1 = require("../domains/05.usersServices");
const models_1 = require("../models");
const prepareQuery_1 = require("../application/prepareQuery");
exports.usersRouter = (0, express_1.Router)({});
exports.usersRouter.get('/', checkAuthMware_1.checkAuthMware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = (0, prepareQuery_1.prepareQueries)(req.query);
    const users = yield _05_usersQueryRepository_1.usersQueryRepository
        .getUsersByQuery(query);
    res.status(models_1.HTTP.OK_200).json(users); // TEST #4.2, #4.7, #4.15
}));
exports.usersRouter.post('/', checkAuthMware_1.checkAuthMware, checkReqBodyMware_1.testAddUserReqBody, checkReqBodyMware_1.checkReqBodyMware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newUserId = yield _05_usersServices_1.usersServices.createUser(req.body, req.socket.remoteAddress);
    const user = yield _05_usersQueryRepository_1.usersQueryRepository.getUserById(newUserId);
    if (user)
        res.status(models_1.HTTP.CREATED_201).json(user); // TEST #4.5, #4.6
}));
exports.usersRouter.delete('/:id', checkAuthMware_1.checkAuthMware, checkParamMware_1.checkIsObjectId, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield _05_usersServices_1.usersServices.deleteUserById(req.params.id);
    if (result)
        res.sendStatus(models_1.HTTP.NO_CONTENT_204); // TEST #4.
    else
        res.sendStatus(models_1.HTTP.NOT_FOUND_404);
}));
