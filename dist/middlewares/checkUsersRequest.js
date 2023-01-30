"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUsersRequest = void 0;
<<<<<<< HEAD
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
exports.checkUsersRequest = (0, express_rate_limit_1.default)({
    windowMs: 10 * 1000,
    max: 6,
    standardHeaders: false,
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
=======
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
        const timeStampArr4 = new Date(usersRequests[5].createdAt).getTime();
        const diff = timeStampArr0 - timeStampArr4;
        const seconds = Math.floor(diff / 1000 % 60);
        console.log(seconds);
        if (seconds < 10 && usersRequests.length > 5) {
            res.sendStatus(models_1.HTTP.TOO_MANY_REQUESTS_429);
            return;
        }
        else {
            // await usersRequestRepository.deleteLogs(userLog);
            next();
        }
    }
>>>>>>> parent of 1308791 (fix 429 response)
});
