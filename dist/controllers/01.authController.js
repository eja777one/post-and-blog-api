"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const inversify_1 = require("inversify");
const _01_authService_1 = require("../domains/01.authService");
const add_1 = __importDefault(require("date-fns/add"));
const models_1 = require("../models");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    login(req, res) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const ip = req.ip;
            const { loginOrEmail, password } = req.body;
            const deviceName = `${(_a = req.useragent) === null || _a === void 0 ? void 0 : _a.browser} ${(_b = req.useragent) === null || _b === void 0 ? void 0 : _b.version}`;
            const result = yield this.authService
                .checkAuth(loginOrEmail, password, ip, deviceName);
            res.status(result.statusCode);
            if (result.data) {
                res.cookie('refreshToken', result.data.refreshToken, {
                    secure: process.env.NODE_ENV !== "cookie",
                    httpOnly: true,
                    expires: (0, add_1.default)(new Date(), { minutes: 60 })
                })
                    .json({ accessToken: result.data.accessToken });
            }
            res.send();
        });
    }
    sendPassRecoveryCode(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.authService.sendPasswordRecoveryCode(req.body.email);
            res.sendStatus(models_1.HTTP.NO_CONTENT_204);
        });
    }
    setNewPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.authService.updatePassword(req.body.newPassword, req.body.recoveryCode);
            res.status(result.statusCode).json(result.error);
        });
    }
    refreshTokens(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.authService
                .getNewTokensPair(req.cookies.refreshToken);
            res.status(result.statusCode);
            if (result.data) {
                res.cookie('refreshToken', result.data.refreshToken, {
                    secure: process.env.NODE_ENV !== "cookie",
                    httpOnly: true,
                    expires: (0, add_1.default)(new Date(), { seconds: 20 }),
                })
                    .json({ accessToken: result.data.accessToken });
            }
            res.send();
        });
    }
    confirmEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.authService.confirmEmail(req.body.code);
            res.status(result.statusCode).json(result.error);
        });
    }
    registration(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.authService.createUser(req.body, req.ip);
            res.status(result.statusCode).json(result.error);
        });
    }
    resendEmailConfirm(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.authService.resendConfirmation(req.body.email);
            res.status(result.statusCode).json(result.error);
        });
    }
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.authService
                .deleteRefreshToken(req.cookies.refreshToken);
            res.sendStatus(result.statusCode);
        });
    }
    getMyInfo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.user)
                return res.sendStatus(models_1.HTTP.UNAUTHORIZED_401);
            const user = {
                email: req.user.email,
                login: req.user.login,
                userId: req.user.id
            };
            res.status(models_1.HTTP.OK_200).json(user);
        });
    }
};
AuthController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(_01_authService_1.AuthService)),
    __metadata("design:paramtypes", [_01_authService_1.AuthService])
], AuthController);
exports.AuthController = AuthController;
;
