"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authValidationMiddleware = exports.inputValidationMiddleware = void 0;
const express_validator_1 = require("express-validator");
const inputValidationMiddleware = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const myErrors = []; // BAD BAD BAD
        for (let el of errors.array()) {
            myErrors.push({
                message: `Incorrect ${el.param}`,
                field: el.param
            });
        }
        return res.status(400).json({ errorsMessages: myErrors });
    }
    else {
        next();
    }
    ;
};
exports.inputValidationMiddleware = inputValidationMiddleware;
const authValidationMiddleware = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty())
        return res.sendStatus(401);
    else
        next();
};
exports.authValidationMiddleware = authValidationMiddleware;
