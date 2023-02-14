"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRouter = void 0;
const express_1 = require("express");
const _00_compositionRoot_1 = require("./00.compositionRoot");
const postController_1 = require("../features/posts/api/postController");
const authMware_1 = require("../middlewares/authMware");
const checkParamMware_1 = require("../middlewares/checkParamMware");
const checkAuthMware_1 = require("../middlewares/checkAuthMware");
const checkReqBodyMware_1 = require("../middlewares/checkReqBodyMware");
exports.postsRouter = (0, express_1.Router)({});
const postsController = _00_compositionRoot_1.container.resolve(postController_1.PostsController);
exports.postsRouter.get('/:id', authMware_1.addOptionalUserInfo, checkParamMware_1.checkIsObjectId, postsController.getPost.bind(postsController)); //ok
exports.postsRouter.get('/', authMware_1.addOptionalUserInfo, postsController.getPosts.bind(postsController)); //ok
exports.postsRouter.post('/', checkAuthMware_1.checkAuthMware, checkReqBodyMware_1.testPostsReqBody, checkReqBodyMware_1.checkReqBodyMware, postsController.createPost.bind(postsController)); //ok
exports.postsRouter.put('/:id', checkAuthMware_1.checkAuthMware, checkParamMware_1.checkIsObjectId, checkReqBodyMware_1.testPostsReqBody, checkReqBodyMware_1.checkReqBodyMware, postsController.updatePost.bind(postsController)); //ok
exports.postsRouter.delete('/:id', checkAuthMware_1.checkAuthMware, checkParamMware_1.checkIsObjectId, postsController.deletePost.bind(postsController)); //ok
exports.postsRouter.put('/:postId/like-status', authMware_1.authMware, checkParamMware_1.checkIsObjectId, checkReqBodyMware_1.testLikeCommentBody, checkReqBodyMware_1.checkReqBodyMware, postsController.changeLikeStatus.bind(postsController));
exports.postsRouter.get('/:postId/comments', authMware_1.addOptionalUserInfo, checkParamMware_1.checkIsObjectId, postsController.getPostsComments.bind(postsController)); //ok
exports.postsRouter.post('/:postId/comments', authMware_1.authMware, checkParamMware_1.checkIsObjectId, checkReqBodyMware_1.testCommentBody, checkReqBodyMware_1.checkReqBodyMware, postsController.createPostsComment.bind(postsController)); //ok
