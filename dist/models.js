"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordDataDBModel = exports.TokensMetaDBModel = exports.CommentDBModel = exports.LikeStatus = exports.UserDBModel = exports.PostDBModel = exports.BlogDBModel = exports.HTTP = exports.sortDirection = exports.PostInputModel = void 0;
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
class PostDBModel {
    constructor(_id, title, shortDescription, content, blogId, blogName, createdAt) {
        this._id = _id;
        this.title = title;
        this.shortDescription = shortDescription;
        this.content = content;
        this.blogId = blogId;
        this.blogName = blogName;
        this.createdAt = createdAt;
    }
}
exports.PostDBModel = PostDBModel;
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
var LikeStatus;
(function (LikeStatus) {
    LikeStatus["None"] = "None";
    LikeStatus["Like"] = "Like";
    LikeStatus["Dislike"] = "Dislike";
})(LikeStatus = exports.LikeStatus || (exports.LikeStatus = {}));
class CommentDBModel {
    constructor(_id, content, userId, userLogin, createdAt, postId, likesCount, dislikesCount, myStatus) {
        this._id = _id;
        this.content = content;
        this.userId = userId;
        this.userLogin = userLogin;
        this.createdAt = createdAt;
        this.postId = postId;
        this.likesCount = likesCount;
        this.dislikesCount = dislikesCount;
        this.myStatus = myStatus;
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
