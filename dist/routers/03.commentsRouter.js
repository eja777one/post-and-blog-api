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
const checkParamMware_1 = require("../middlewares/checkParamMware");
const authMware_1 = require("../middlewares/authMware");
const checkReqBodyMware_1 = require("../middlewares/checkReqBodyMware");
const _03_commentsQRepo_1 = require("../repositories/03.commentsQRepo");
const _03_commentsService_1 = require("../domains/03.commentsService");
const models_1 = require("../models");
exports.commentsRouter = (0, express_1.Router)({});
class CommentsController {
    updateComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.user)
                return res.sendStatus(models_1.HTTP.UNAUTHORIZED_401); // TEST #5.3
            const modifiedStatus = yield _03_commentsService_1.commentsService
                .updateComment(req.params.commentId, req.user, req.body);
            res.sendStatus(models_1.HTTP[modifiedStatus]);
        });
    }
    deleteComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.user)
                return res.sendStatus(models_1.HTTP.UNAUTHORIZED_401);
            const deletedStatus = yield _03_commentsService_1.commentsService
                .deleteComment(req.params.commentId, req.user);
            res.sendStatus(models_1.HTTP[deletedStatus]);
        });
    }
    getComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield _03_commentsQRepo_1.commentsQueryRepository
                .getComment(req.params.commentId);
            if (!comment)
                return res.sendStatus(models_1.HTTP.NOT_FOUND_404); // TEST #5.7, #5.12
            res.status(models_1.HTTP.OK_200).json(comment); // TEST #5.6
        });
    }
}
;
const commentsController = new CommentsController();
exports.commentsRouter.put('/:commentId', authMware_1.authMware, checkParamMware_1.checkIsObjectId, checkReqBodyMware_1.testCommentBody, checkReqBodyMware_1.checkReqBodyMware, commentsController.updateComment);
exports.commentsRouter.delete('/:commentId', authMware_1.authMware, checkParamMware_1.checkIsObjectId, commentsController.deleteComment);
exports.commentsRouter.get('/:commentId', checkParamMware_1.checkIsObjectId, commentsController.getComment);
