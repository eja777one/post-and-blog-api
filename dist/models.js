"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTP = exports.sortDirection = void 0;
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
    HTTP[HTTP["NOT_FOUND_404"] = 404] = "NOT_FOUND_404";
})(HTTP = exports.HTTP || (exports.HTTP = {}));
;
