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
exports.checkUsersRequest = void 0;
const bson_1 = require("bson");
const models_1 = require("./../models");
const _07_usersDBRequest_1 = require("../repositories/07.usersDBRequest");
const checkUsersRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const url = req.protocol + '://' + req.get('host') + req.originalUrl;
    const ip = req.headers['x-forwarded-for']
        || req.socket.remoteAddress
        || null;
    const createdAt = new Date().toISOString();
    const userLog = {
        _id: new bson_1.ObjectID(),
        url,
        ip,
        createdAt
    };
    const addLog = yield _07_usersDBRequest_1.usersRequestRepository.addLog(userLog);
    const usersRequests = yield _07_usersDBRequest_1.usersRequestRepository.getLogs(userLog);
    if (usersRequests.length < 6)
        next();
    else {
        const timeStampArr0 = new Date(usersRequests[0].createdAt).getTime();
        const timeStampArr4 = new Date(usersRequests[4].createdAt).getTime();
        const diff = timeStampArr0 - timeStampArr4;
        const seconds = Math.floor(diff / 1000 % 60);
        if (seconds < 10)
            res.sendStatus(models_1.HTTP.TOO_MANY_REQUESTS_429);
        else
            next();
    }
});
exports.checkUsersRequest = checkUsersRequest;
