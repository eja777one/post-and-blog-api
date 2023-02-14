"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRouter = void 0;
const express_1 = require("express");
const _00_compositionRoot_1 = require("./00.compositionRoot");
const blogsController_1 = require("../features/blogs/api/blogsController");
const checkParamMware_1 = require("../middlewares/checkParamMware");
const checkAuthMware_1 = require("../middlewares/checkAuthMware");
const checkReqBodyMware_1 = require("../middlewares/checkReqBodyMware");
const authMware_1 = require("../middlewares/authMware");
exports.blogsRouter = (0, express_1.Router)({});
const blogsController = _00_compositionRoot_1.container.resolve(blogsController_1.BlogsController);
exports.blogsRouter.get('/:id', checkParamMware_1.checkIsObjectId, blogsController.getBlog.bind(blogsController)); //ok
exports.blogsRouter.get('/', blogsController.getBlogs.bind(blogsController)); //ok
exports.blogsRouter.post('/', checkAuthMware_1.checkAuthMware, checkReqBodyMware_1.testBlogsReqBody, checkReqBodyMware_1.checkReqBodyMware, blogsController.createBlog.bind(blogsController)); //ok
exports.blogsRouter.put('/:id', checkAuthMware_1.checkAuthMware, checkParamMware_1.checkIsObjectId, checkReqBodyMware_1.testBlogsReqBody, checkReqBodyMware_1.checkReqBodyMware, blogsController.updateBlog.bind(blogsController)); //ok
exports.blogsRouter.delete('/:id', checkAuthMware_1.checkAuthMware, checkParamMware_1.checkIsObjectId, blogsController.deleteBlog.bind(blogsController));
exports.blogsRouter.get('/:blogId/posts', authMware_1.addOptionalUserInfo, checkParamMware_1.checkIsObjectId, blogsController.getBlogsPosts.bind(blogsController)); //ok
exports.blogsRouter.post('/:blogId/posts', checkAuthMware_1.checkAuthMware, checkParamMware_1.checkIsObjectId, checkReqBodyMware_1.testPostsReqBodyNoBlogId, checkReqBodyMware_1.checkReqBodyMware, blogsController.createBlogsPost.bind(blogsController)); //ok
