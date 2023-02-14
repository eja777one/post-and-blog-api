"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.TestController = void 0;
const inversify_1 = require("inversify");
const _06_tokensDBRepo_1 = require("../repositories/06.tokensDBRepo");
const _07_usersReqDBRepo_1 = require("../repositories/07.usersReqDBRepo");
const _02_blogsDBRepo_1 = require("../repositories/02.blogsDBRepo");
const _04_postsDBRepo_1 = require("../repositories/04.postsDBRepo");
const _03_commentsDBRepo_1 = require("../repositories/03.commentsDBRepo");
const _05_usersDBRepo_1 = require("../repositories/05.usersDBRepo");
const _08_passwordsRecDBRepo_1 = require("../repositories/08.passwordsRecDBRepo");
const models_1 = require("../models");
let TestController = class TestController {
    constructor(tokensMetaRepository, usersRequestRepository, passwordRecoveryRepository, blogsRepository, postsRepository, commentsRepository, usersRepository) {
        this.tokensMetaRepository = tokensMetaRepository;
        this.usersRequestRepository = usersRequestRepository;
        this.passwordRecoveryRepository = passwordRecoveryRepository;
        this.blogsRepository = blogsRepository;
        this.postsRepository = postsRepository;
        this.commentsRepository = commentsRepository;
        this.usersRepository = usersRepository;
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
};
TestController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(_06_tokensDBRepo_1.TokensMetaRepository)),
    __param(1, (0, inversify_1.inject)(_07_usersReqDBRepo_1.UsersRequestRepository)),
    __param(2, (0, inversify_1.inject)(_08_passwordsRecDBRepo_1.PasswordRecoveryRepository)),
    __param(3, (0, inversify_1.inject)(_02_blogsDBRepo_1.BlogsRepository)),
    __param(4, (0, inversify_1.inject)(_04_postsDBRepo_1.PostsRepository)),
    __param(5, (0, inversify_1.inject)(_03_commentsDBRepo_1.CommentsRepository)),
    __param(6, (0, inversify_1.inject)(_05_usersDBRepo_1.UsersRepository)),
    __metadata("design:paramtypes", [_06_tokensDBRepo_1.TokensMetaRepository,
        _07_usersReqDBRepo_1.UsersRequestRepository,
        _08_passwordsRecDBRepo_1.PasswordRecoveryRepository,
        _02_blogsDBRepo_1.BlogsRepository,
        _04_postsDBRepo_1.PostsRepository,
        _03_commentsDBRepo_1.CommentsRepository,
        _05_usersDBRepo_1.UsersRepository])
], TestController);
exports.TestController = TestController;
;
