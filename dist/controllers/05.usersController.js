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
exports.UsersController = void 0;
const inversify_1 = require("inversify");
const prepareQuery_1 = require("./../application/prepareQuery");
const _05_usersService_1 = require("./../domains/05.usersService");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    getUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = (0, prepareQuery_1.prepareQueries)(req.query);
            const result = yield this.usersService.getUsers(query);
            res.status(result.statusCode).json(result.data); // TEST #4.2, #4.7, #4.15
        });
    }
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.usersService.createUser(req.body, req.ip);
            res.status(result.statusCode).json(result.data); // TEST #4.5, #4.6
        });
    }
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.usersService.deleteUser(req.params.id);
            res.sendStatus(result.statusCode); // TEST #4.
        });
    }
};
UsersController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(_05_usersService_1.UsersService)),
    __metadata("design:paramtypes", [_05_usersService_1.UsersService])
], UsersController);
exports.UsersController = UsersController;
;
