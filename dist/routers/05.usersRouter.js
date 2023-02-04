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
const checkParamMware_1 = require("../middlewares/checkParamMware");
const _05_usersService_1 = require("../domains/05.usersService");
const models_1 = require("../models");
const prepareQuery_1 = require("../application/prepareQuery");
const checkReqBodyMware_1 = require("../middlewares/checkReqBodyMware");
exports.usersRouter = (0, express_1.Router)({});
class UsersController {
    constructor() {
        this.usersService = new _05_usersService_1.UsersService();
    }
    getUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = (0, prepareQuery_1.prepareQueries)(req.query);
            const users = yield this.usersService.getUsers(query);
            res.status(models_1.HTTP.OK_200).json(users); // TEST #4.2, #4.7, #4.15
        });
    }
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const newUser = yield this.usersService.createUser(req.body, req.ip);
            if (!newUser)
                return res.sendStatus(models_1.HTTP.NOT_FOUND_404);
            res.status(models_1.HTTP.CREATED_201).json(newUser); // TEST #4.5, #4.6
        });
    }
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleted = yield this.usersService.deleteUser(req.params.id);
            if (!deleted)
                return res.sendStatus(models_1.HTTP.NOT_FOUND_404);
            res.sendStatus(models_1.HTTP.NO_CONTENT_204); // TEST #4.
        });
    }
}
;
const usersController = new UsersController();
exports.usersRouter.get('/', checkAuthMware_1.checkAuthMware, usersController.getUsers.bind(usersController));
exports.usersRouter.post('/', checkAuthMware_1.checkAuthMware, checkReqBodyMware_1.testAddUserReqBody, checkReqBodyMware_1.checkReqBodyMware, usersController.createUser.bind(usersController));
exports.usersRouter.delete('/:id', checkAuthMware_1.checkAuthMware, checkParamMware_1.checkIsObjectId, usersController.deleteUser.bind(usersController));
