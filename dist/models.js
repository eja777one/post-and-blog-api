"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogDBModel = exports.TokensDTO = exports.PasswordDataDBModel = exports.TokensMetaDBModel = exports.CommentDBModel = exports.UserDBModel = exports.HTTP = exports.sortDirection = exports.PostDBModel = exports.PostInputModel = exports.BLLResponse = exports.FieldError = exports.APIErrorResult = void 0;
// export type APIErrorResult = {
// 	errorsMessages: Array<FieldError>
// };
class APIErrorResult {
    constructor(errorsMessages) {
        this.errorsMessages = errorsMessages;
    }
}
exports.APIErrorResult = APIErrorResult;
;
class FieldError {
    constructor(field) {
        this.message = `incorrect ${field}`;
        this.field = field;
    }
}
exports.FieldError = FieldError;
;
class BLLResponse {
    constructor(statusCode, data, message, error) {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.error = error;
    }
}
exports.BLLResponse = BLLResponse;
;
class PostInputModel {
    constructor(title, shortDescription, content, blogId) {
        this.title = title;
        this.shortDescription = shortDescription;
        this.content = content;
        this.blogId = blogId;
    }
}
exports.PostInputModel = PostInputModel;
;
class PostDBModel {
    constructor(_id, title, shortDescription, content, blogId, blogName, createdAt, likesCount, dislikesCount, usersLikeStatus) {
        this._id = _id;
        this.title = title;
        this.shortDescription = shortDescription;
        this.content = content;
        this.blogId = blogId;
        this.blogName = blogName;
        this.createdAt = createdAt;
        this.likesCount = likesCount;
        this.dislikesCount = dislikesCount;
        this.usersLikeStatus = usersLikeStatus;
    }
}
exports.PostDBModel = PostDBModel;
;
var sortDirection;
(function (sortDirection) {
    sortDirection["asc"] = "asc";
    sortDirection["desc"] = "desc";
})(sortDirection = exports.sortDirection || (exports.sortDirection = {}));
;
var HTTP;
(function (HTTP) {
    HTTP[HTTP["OK_200"] = 200] = "OK_200";
    HTTP[HTTP["CREATED_201"] = 201] = "CREATED_201";
    HTTP[HTTP["NO_CONTENT_204"] = 204] = "NO_CONTENT_204";
    HTTP[HTTP["BAD_REQUEST_400"] = 400] = "BAD_REQUEST_400";
    HTTP[HTTP["UNAUTHORIZED_401"] = 401] = "UNAUTHORIZED_401";
    HTTP[HTTP["FORBIDDEN_403"] = 403] = "FORBIDDEN_403";
    HTTP[HTTP["NOT_FOUND_404"] = 404] = "NOT_FOUND_404";
    HTTP[HTTP["METHOD_NOT_ALLOWED_405"] = 405] = "METHOD_NOT_ALLOWED_405";
    HTTP[HTTP["TOO_MANY_REQUESTS_429"] = 429] = "TOO_MANY_REQUESTS_429";
})(HTTP = exports.HTTP || (exports.HTTP = {}));
;
class UserDBModel {
    constructor(_id, accountData, emailConfirmation, registrationDataType) {
        this._id = _id;
        this.accountData = accountData;
        this.emailConfirmation = emailConfirmation;
        this.registrationDataType = registrationDataType;
    }
}
exports.UserDBModel = UserDBModel;
;
// export enum LikeStatus {
// 	'None' = 'None',
// 	'Like' = 'Like',
// 	'Dislike' = 'Dislike',
// };
class CommentDBModel {
    constructor(_id, content, userId, userLogin, createdAt, postId, likesCount, dislikesCount, usersLikeStatus) {
        this._id = _id;
        this.content = content;
        this.userId = userId;
        this.userLogin = userLogin;
        this.createdAt = createdAt;
        this.postId = postId;
        this.likesCount = likesCount;
        this.dislikesCount = dislikesCount;
        this.usersLikeStatus = usersLikeStatus;
    }
}
exports.CommentDBModel = CommentDBModel;
;
class TokensMetaDBModel {
    constructor(_id, createdAt, expiredAt, deviceId, ip, deviceName, userId) {
        this._id = _id;
        this.createdAt = createdAt;
        this.expiredAt = expiredAt;
        this.deviceId = deviceId;
        this.ip = ip;
        this.deviceName = deviceName;
        this.userId = userId;
    }
}
exports.TokensMetaDBModel = TokensMetaDBModel;
;
class PasswordDataDBModel {
    constructor(_id, userId, passwordRecoveryCode, createdAt, expiredAt) {
        this._id = _id;
        this.userId = userId;
        this.passwordRecoveryCode = passwordRecoveryCode;
        this.createdAt = createdAt;
        this.expiredAt = expiredAt;
    }
}
exports.PasswordDataDBModel = PasswordDataDBModel;
;
class TokensDTO {
    constructor(accessToken, refreshToken) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }
}
exports.TokensDTO = TokensDTO;
class BlogDBModel {
    constructor(_id, name, description, websiteUrl, createdAt) {
        this._id = _id;
        this.name = name;
        this.description = description;
        this.websiteUrl = websiteUrl;
        this.createdAt = createdAt;
    }
}
exports.BlogDBModel = BlogDBModel;
;
