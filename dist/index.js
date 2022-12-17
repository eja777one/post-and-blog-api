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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const posts_db_repository_1 = require("./repositories/posts-db-repository");
const blogs_db_repository_1 = require("./repositories/blogs-db-repository");
const posts_router_1 = require("./routers/posts-router");
const blogs_router_1 = require("./routers/blogs-router");
const HTTPStatusCodes_1 = require("./HTTPStatusCodes");
const db_1 = require("./repositories/db");
exports.app = (0, express_1.default)();
const port = process.env.PORT || 3003;
const jsonBodyMiddleware = express_1.default.json();
exports.app.use(jsonBodyMiddleware);
exports.app.use('/ht_02/api/blogs', blogs_router_1.blogsRouter);
exports.app.use('/ht_02/api/posts', posts_router_1.postsRouter);
exports.app.delete('/ht_02/api/testing/all-data', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield blogs_db_repository_1.blogRepository.deleteAll();
    yield posts_db_repository_1.postsRepository.deleteAll();
    res.sendStatus(HTTPStatusCodes_1.HTTP.NO_CONTENT_204); // TEST #1.1
}));
const startApp = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_1.runDb)();
    exports.app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
});
startApp();
