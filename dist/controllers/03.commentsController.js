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
exports.CommentsController = void 0;
const models_1 = require("../models");
class CommentsController {
    constructor(commentsService) {
        this.commentsService = commentsService;
    }
    updateComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.user)
                return res.sendStatus(models_1.HTTP.UNAUTHORIZED_401); // TEST #5.3
            const modifiedStatus = yield this.commentsService
                .updateComment(req.params.commentId, req.user, req.body);
            res.sendStatus(models_1.HTTP[modifiedStatus]);
        });
    }
    changeLikeStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.user)
                return res.sendStatus(models_1.HTTP.UNAUTHORIZED_401);
            const updated = yield this.commentsService
                .changeLikeStatus(req.params.commentId, req.body.likeStatus);
            if (!updated)
                return res.sendStatus(models_1.HTTP.NOT_FOUND_404);
            res.sendStatus(models_1.HTTP.NO_CONTENT_204);
        });
    }
    deleteComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.user)
                return res.sendStatus(models_1.HTTP.UNAUTHORIZED_401);
            const deletedStatus = yield this.commentsService
                .deleteComment(req.params.commentId, req.user);
            res.sendStatus(models_1.HTTP[deletedStatus]);
        });
    }
    getComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield this.commentsService.getComment(req.params.commentId);
            if (!comment)
                return res.sendStatus(models_1.HTTP.NOT_FOUND_404); // TEST #5.7, #5.12
            res.status(models_1.HTTP.OK_200).json(comment); // TEST #5.6
        });
    }
}
exports.CommentsController = CommentsController;
;
