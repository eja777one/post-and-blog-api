"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIsObjectId = void 0;
const mongodb_1 = require("mongodb");
const checkIsObjectId = (req, res, next) => {
    const id = req.params.id;
    const blogId = req.params.blogId;
    const reqId = id || blogId;
    if (mongodb_1.ObjectId.isValid(reqId))
        next();
    else
        res.sendStatus(404);
    // TEST #2.5, #2.7, #2.91, #2.93, #2.12, #3.5, #3.7, #3.12, #4.8
};
exports.checkIsObjectId = checkIsObjectId;
