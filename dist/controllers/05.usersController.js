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
exports.UsersController = void 0;
const prepareQuery_1 = require("./../application/prepareQuery");
const models_1 = require("../models");
class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
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
exports.UsersController = UsersController;
;
