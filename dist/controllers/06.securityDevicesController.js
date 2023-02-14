"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.SecurityDevicesController = void 0;
const inversify_1 = require("inversify");
const _06_securityDevicesService_1 = require("../domains/06.securityDevicesService");
let SecurityDevicesController = class SecurityDevicesController {
    constructor(securityDevicesService) {
        this.securityDevicesService = securityDevicesService;
    }
    getDevices(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.securityDevicesService
                .getUsersSessions(req.cookies.refreshToken);
            res.status(result.statusCode).json(result.data);
        });
    }
    deleteNonCurrentDevices(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.securityDevicesService
                .deleteOtherSessions(req.cookies.refreshToken);
            res.sendStatus(result.statusCode);
        });
    }
    deleteDevice(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.securityDevicesService
                .deleteThisSession(req.cookies.refreshToken, req.params.deviceId);
            res.sendStatus(result.statusCode);
        });
    }
};
SecurityDevicesController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(_06_securityDevicesService_1.SecurityDevicesService)),
    __metadata("design:paramtypes", [_06_securityDevicesService_1.SecurityDevicesService])
], SecurityDevicesController);
exports.SecurityDevicesController = SecurityDevicesController;
;
