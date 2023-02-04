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
const _02_blogsDBRepo_1 = require("../repositories/02.blogsDBRepo");
const _04_postsDBRepo_1 = require("../repositories/04.postsDBRepo");
const _03_commentsDBRepo_1 = require("../repositories/03.commentsDBRepo");
const _05_usersDBRepo_1 = require("../repositories/05.usersDBRepo");
const _08_passwordsRecDBRepo_1 = require("../repositories/08.passwordsRecDBRepo");
const models_1 = require("../models");
exports.testsRouter = (0, express_1.Router)({});
class TestController {
    constructor() {
        this.tokensMetaRepository = new _06_tokensDBRepo_1.TokensMetaRepository();
        this.usersRequestRepository = new _07_usersReqDBRepo_1.UsersRequestRepository();
        this.passwordRecoveryRepository = new _08_passwordsRecDBRepo_1.PasswordRecoveryRepository();
        this.blogsRepository = new _02_blogsDBRepo_1.BlogsRepository();
        this.postsRepository = new _04_postsDBRepo_1.PostsRepository();
        this.commentsRepository = new _03_commentsDBRepo_1.CommentsRepository();
        this.usersRepository = new _05_usersDBRepo_1.UsersRepository();
    }
    deleteAllData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.blogsRepository.deleteAll();
            yield this.postsRepository.deleteAll();
            yield this.usersRepository.deleteAll();
            yield this.commentsRepository.deleteAll();
            yield this.usersRequestRepository.deleteAll();
            yield this.tokensMetaRepository.deleteAll();
            yield this.passwordRecoveryRepository.deleteAll();
            res.sendStatus(models_1.HTTP.NO_CONTENT_204); // TEST #1.1
        });
    }
}
;
const testController = new TestController();
exports.testsRouter.delete('/', testController.deleteAllData.bind(testController));
