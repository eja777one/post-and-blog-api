"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentsRouter = void 0;
const express_1 = require("express");
const commentsController_1 = require("../features/comments/api/commentsController");
const _00_compositionRoot_1 = require("./00.compositionRoot");
const checkParamMware_1 = require("../middlewares/checkParamMware");
const authMware_1 = require("../middlewares/authMware");
const checkReqBodyMware_1 = require("../middlewares/checkReqBodyMware");
exports.commentsRouter = (0, express_1.Router)({});
const commentsController = _00_compositionRoot_1.container.resolve(commentsController_1.CommentsController);
exports.commentsRouter.get('/:commentId', authMware_1.addOptionalUserInfo, checkParamMware_1.checkIsObjectId, commentsController.getComment.bind(commentsController)); //ok
exports.commentsRouter.put('/:commentId', authMware_1.authMware, checkParamMware_1.checkIsObjectId, checkReqBodyMware_1.testCommentBody, checkReqBodyMware_1.checkReqBodyMware, commentsController.updateComment.bind(commentsController)); //ok
exports.commentsRouter.delete('/:commentId', authMware_1.authMware, checkParamMware_1.checkIsObjectId, commentsController.deleteComment.bind(commentsController)); //ok
exports.commentsRouter.put('/:commentId/like-status', authMware_1.authMware, checkParamMware_1.checkIsObjectId, checkReqBodyMware_1.testLikeCommentBody, checkReqBodyMware_1.checkReqBodyMware, commentsController.changeLikeStatus.bind(commentsController)); //ok
