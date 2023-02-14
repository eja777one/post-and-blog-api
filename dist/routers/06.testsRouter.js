"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testsRouter = void 0;
const express_1 = require("express");
const testController_1 = require("../features/test/testController");
const _00_compositionRoot_1 = require("./00.compositionRoot");
exports.testsRouter = (0, express_1.Router)({});
const testController = _00_compositionRoot_1.container.resolve(testController_1.TestController);
exports.testsRouter.delete('/', testController.deleteAllData.bind(testController));
