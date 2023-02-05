"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testsRouter = void 0;
const express_1 = require("express");
const _00_compositionRoot_1 = require("./00.compositionRoot");
exports.testsRouter = (0, express_1.Router)({});
exports.testsRouter.delete('/', _00_compositionRoot_1.testController.deleteAllData.bind(_00_compositionRoot_1.testController));
