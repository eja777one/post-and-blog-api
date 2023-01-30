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
const _07_usersDBRequest_1 = require("../repositories/07.usersDBRequest");
const checkUsersRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const attemtsInterval = 10 * 1000; // 10 sec
    const currentTime = new Date(); // текущая дата и время
    console.log(currentTime, 'current');
    const attemptTime = new Date(currentTime.getTime() - attemtsInterval); // дата и время за 10 сек до текущей
    console.log(attemptTime, 'attempt');
    console.log(attemptTime.getTime(), 'attempt');
    // const userLog = {
    //   _id: new ObjectId(),
    //   url: req.url,
    //   ip: req.ip,
    //   createdAt: attemptTime
    // };
    const userLog = {
        _id: new mongodb_1.ObjectId(),
        url: req.url,
        ip: req.ip,
        createdAt: currentTime
    };
    const usersRequests = yield _07_usersDBRequest_1.usersRequestRepository.getLogs(userLog, attemptTime);
    yield _07_usersDBRequest_1.usersRequestRepository.addLog(userLog);
    // console.log(usersRequests)
    if (usersRequests < 5) {
        next();
    }
    else {
        res.sendStatus(429);
    }
});
exports.checkUsersRequest = checkUsersRequest;
