"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.port = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const blogs_router_1 = require("./routers/blogs-router");
const posts_router_1 = require("./routers/posts-router");
const tests_router_1 = require("./routers/tests-router");
exports.app = (0, express_1.default)();
exports.port = process.env.PORT || 3003;
const jsonBodyMiddleware = express_1.default.json();
exports.app.use(jsonBodyMiddleware);
exports.app.use('/hometask_04/api/blogs', blogs_router_1.blogsRouter);
exports.app.use('/hometask_04/api/posts', posts_router_1.postsRouter);
exports.app.use('/hometask_04/api/testing/all-data', tests_router_1.testsRouter);
