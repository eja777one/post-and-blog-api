"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const posts_repository_1 = require("./repositories/posts-repository");
const blogs_repository_1 = require("./repositories/blogs-repository");
const posts_router_1 = require("./routers/posts-router");
const blogs_router_1 = require("./routers/blogs-router");
const HTTPStatusCodes_1 = require("./HTTPStatusCodes");
exports.app = (0, express_1.default)();
const port = process.env.PORT || 3001;
const jsonBodyMiddleware = express_1.default.json();
exports.app.use(jsonBodyMiddleware);
exports.app.use('/ht_02/api/blogs', blogs_router_1.blogsRouter);
exports.app.use('/ht_02/api/posts', posts_router_1.postsRouter);
exports.app.delete('/ht_02/apr/testing/all-data', (req, res) => {
    blogs_repository_1.blogRepository.deleteAll();
    posts_repository_1.postsRepository.deleteAll();
    res.sendStatus(HTTPStatusCodes_1.HTTP.NO_CONTENT_204); // TEST #1.1
});
exports.app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
