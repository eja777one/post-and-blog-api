"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.port = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const _01_authRouter_1 = require("./routers/01.authRouter");
const _02_blogsRouter_1 = require("./routers/02.blogsRouter");
const _03_commentsRouter_1 = require("./routers/03.commentsRouter");
const _04_postsRouter_1 = require("./routers/04.postsRouter");
const _06_testsRouter_1 = require("./routers/06.testsRouter");
const _05_usersRouter_1 = require("./routers/05.usersRouter");
const _07_securityDevicesRouter_1 = require("./routers/07.securityDevicesRouter");
const allowedMethodsMware_1 = require("./middlewares/allowedMethodsMware");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_useragent_1 = __importDefault(require("express-useragent"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
exports.app = (0, express_1.default)();
exports.port = process.env.PORT || 3003;
;
exports.app.set('trust proxy', true);
const jsonBodyMiddleware = express_1.default.json();
exports.app.use(jsonBodyMiddleware);
exports.app.use(allowedMethodsMware_1.allowedMethods);
exports.app.use((0, cookie_parser_1.default)('cookie'));
exports.app.use(express_useragent_1.default.express());
exports.app.use('/hometask_09/api/auth', _01_authRouter_1.authRouter);
exports.app.use('/hometask_09/api/blogs', _02_blogsRouter_1.blogsRouter);
exports.app.use('/hometask_09/api/comments', _03_commentsRouter_1.commentsRouter);
exports.app.use('/hometask_09/api/posts', _04_postsRouter_1.postsRouter);
exports.app.use('/hometask_09/api/users', _05_usersRouter_1.usersRouter);
exports.app.use('/hometask_09/api/security/devices', _07_securityDevicesRouter_1.securityDeviceRouter);
exports.app.use('/hometask_09/api/testing/all-data', _06_testsRouter_1.testsRouter);
