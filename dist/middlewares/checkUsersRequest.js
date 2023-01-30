"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUsersRequest = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
exports.checkUsersRequest = (0, express_rate_limit_1.default)({
    windowMs: 10 * 1000,
    max: 6,
    standardHeaders: false,
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
