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
exports.commentsRouter = void 0;
const express_1 = require("express");
const comments_query_repository_1 = require("./../repositories/comments-query-repository");
const comments_services_1 = require("./../domains/comments-services");
const models_1 = require("./../models");
const checkParamMware_1 = require("../middlewares/checkParamMware");
const authMware_1 = require("../middlewares/authMware");
const checkReqBodyMware_1 = require("../middlewares/checkReqBodyMware");
exports.commentsRouter = (0, express_1.Router)({});
exports.commentsRouter.put('/:commentId', authMware_1.authMware, checkParamMware_1.checkIsObjectId, checkReqBodyMware_1.testCommentBody, checkReqBodyMware_1.checkReqBodyMware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        res.sendStatus(models_1.HTTP.UNAUTHORIZED_401); // TEST #5.3
        return;
    }
    ;
    const modified = yield comments_services_1.commentsServices.updateComment(req.params.commentId, req.user, req.body);
    if (modified === '404')
        res.sendStatus(models_1.HTTP.NOT_FOUND_404); // TEST #5.1
    if (modified === '403')
        res.sendStatus(models_1.HTTP.FORBIDDEN_403); // TEST #5.2
    if (modified === '204')
        res.sendStatus(models_1.HTTP.NO_CONTENT_204); // TEST #5.5
}));
exports.commentsRouter.delete('/:commentId', authMware_1.authMware, checkParamMware_1.checkIsObjectId, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        res.sendStatus(models_1.HTTP.UNAUTHORIZED_401);
        return;
    }
    ;
    const deleted = yield comments_services_1.commentsServices.deleteComment(req.params.commentId, req.user);
    if (deleted === '404')
        res.sendStatus(models_1.HTTP.NOT_FOUND_404); // TEST #5.8
    if (deleted === '403')
        res.sendStatus(models_1.HTTP.FORBIDDEN_403); // TEST #5.9
    if (deleted === '204')
        res.sendStatus(models_1.HTTP.NO_CONTENT_204); // TEST #5.11
}));
exports.commentsRouter.get('/:commentId', checkParamMware_1.checkIsObjectId, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield comments_query_repository_1.commentsQueryRepository.getComment(req.params.commentId);
    if (comment)
        res.status(models_1.HTTP.OK_200).json(comment); // TEST #5.6
    else
        res.sendStatus(models_1.HTTP.NOT_FOUND_404); // TEST #5.7, #5.12
}));
