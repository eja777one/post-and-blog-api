"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const express_1 = require("express");
const usersController_1 = require("../features/users/api/usersController");
const _00_compositionRoot_1 = require("./00.compositionRoot");
const checkAuthMware_1 = require("../middlewares/checkAuthMware");
const checkParamMware_1 = require("../middlewares/checkParamMware");
const checkReqBodyMware_1 = require("../middlewares/checkReqBodyMware");
exports.usersRouter = (0, express_1.Router)({});
const usersController = _00_compositionRoot_1.container.resolve(usersController_1.UsersController);
exports.usersRouter.get('/', checkAuthMware_1.checkAuthMware, usersController.getUsers.bind(usersController)); //ok
exports.usersRouter.post('/', checkAuthMware_1.checkAuthMware, checkReqBodyMware_1.testAddUserReqBody, checkReqBodyMware_1.checkReqBodyMware, usersController.createUser.bind(usersController)); //ok
exports.usersRouter.delete('/:id', checkAuthMware_1.checkAuthMware, checkParamMware_1.checkIsObjectId, usersController.deleteUser.bind(usersController)); //ok
