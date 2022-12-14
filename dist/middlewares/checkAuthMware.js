"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuthMware = exports.testBaseAuth = void 0;
const express_validator_1 = require("express-validator");
exports.testBaseAuth = (0, express_validator_1.header)('authorization')
    .isIn(['Basic YWRtaW46cXdlcnR5']);
const checkAuthMware = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.sendStatus(401); // TEST #2.2, #2.8, #2.13, #3.2, #3.8, #3.13
    }
    else
        next();
};
exports.checkAuthMware = checkAuthMware;
