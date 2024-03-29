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
const mongodb_1 = require("mongodb");
const usersReqDBRepo_1 = require("../features/users/infrastructure/usersReqDBRepo");
const usersRequestRepository = new usersReqDBRepo_1.UsersRequestRepository();
const checkUsersRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const attemtsInterval = 10 * 1000;
    const currentTime = new Date();
    const attemptTime = new Date(currentTime.getTime() - attemtsInterval);
    const userLog = {
        _id: new mongodb_1.ObjectId(),
        url: req.url,
        ip: req.ip,
        createdAt: currentTime
    };
    const usersRequests = yield usersRequestRepository.getLogs(userLog, attemptTime);
    yield usersRequestRepository.addLog(userLog);
    if (usersRequests < 5)
        next();
    else
        res.sendStatus(429);
});
exports.checkUsersRequest = checkUsersRequest;
