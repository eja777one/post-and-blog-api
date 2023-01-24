"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkCookie = void 0;
const models_1 = require("./../models");
const checkCookie = (req, res, next) => {
    if (!req.cookies.refreshToken) {
        res.sendStatus(models_1.HTTP.UNAUTHORIZED_401);
    }
    else
        next();
};
exports.checkCookie = checkCookie;
