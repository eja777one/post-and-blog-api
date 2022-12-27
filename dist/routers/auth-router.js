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
exports.authRouter = void 0;
const express_1 = require("express");
const users_services_1 = require("./../domains/users-services");
const models_1 = require("../models");
const checkReqBodyMware_1 = require("../middlewares/checkReqBodyMware");
exports.authRouter = (0, express_1.Router)({});
exports.authRouter.post('/', checkReqBodyMware_1.testLoginPassReqBody, checkReqBodyMware_1.checkReqBodyMware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield users_services_1.usersServices
        .checkAuth(req.body.login, req.body.password);
    if (result)
        res.sendStatus(models_1.HTTP.NO_CONTENT_204);
    else
        res.sendStatus(models_1.HTTP.UNAUTHORIZED_401);
}));
