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
exports.testsRouter = void 0;
const express_1 = require("express");
const _06_tokensDBRepo_1 = require("../repositories/06.tokensDBRepo");
const _07_usersReqDBRepo_1 = require("../repositories/07.usersReqDBRepo");
const _08_passwordsRecDBRepo_1 = require("../repositories/08.passwordsRecDBRepo");
const _02_blogsService_1 = require("../domains/02.blogsService");
const _03_commentsService_1 = require("../domains/03.commentsService");
const _04_postsService_1 = require("../domains/04.postsService");
const _05_usersService_1 = require("../domains/05.usersService");
const models_1 = require("../models");
exports.testsRouter = (0, express_1.Router)({});
class TestController {
    deleteAllData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield _02_blogsService_1.blogService.deleteAll();
            yield _04_postsService_1.postsService.deleteAll();
            yield _05_usersService_1.usersService.deleteAll();
            yield _03_commentsService_1.commentsService.deleteAll();
            yield _07_usersReqDBRepo_1.usersRequestRepository.deleteAll();
            yield _06_tokensDBRepo_1.tokensMetaRepository.deleteAll();
            yield _08_passwordsRecDBRepo_1.passwordRecoveryRepository.deleteAll();
            res.sendStatus(models_1.HTTP.NO_CONTENT_204); // TEST #1.1
        });
    }
}
;
const testController = new TestController();
exports.testsRouter.delete('/', testController.deleteAllData);
