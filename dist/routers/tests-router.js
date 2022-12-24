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
Object.defineProperty(exports, "__esModule", { value: true });
exports.testsRouter = void 0;
const express_1 = require("express");
const posts_services_1 = require("./../domains/posts-services");
const blogs_services_1 = require("./../domains/blogs-services");
const models_1 = require("../models");
exports.testsRouter = (0, express_1.Router)({});
exports.testsRouter.delete('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield blogs_services_1.blogServices.deleteAll();
    yield posts_services_1.postsServices.deleteAll();
    res.sendStatus(models_1.HTTP.NO_CONTENT_204); // TEST #1.1
}));
