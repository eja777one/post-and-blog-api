"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareQueries = void 0;
const models_1 = require("../models");
const prepareQueries = (query) => {
    const queryObj = {
        pageNumber: +query.pageNumber ? +query.pageNumber : 1,
        pageSize: +query.pageSize ? +query.pageSize : 10,
        sortBy: query.sortBy || 'createdAt',
        sortDirection: query.sortDirection || models_1.sortDirection.desc
    };
    if (query.searchNameTerm) {
        queryObj.searchNameTerm = query.searchNameTerm;
    }
    ;
    if (query.searchLoginTerm) {
        queryObj.searchLoginTerm = query.searchLoginTerm;
    }
    ;
    if (query.searchEmailTerm) {
        queryObj.searchEmailTerm = query.searchEmailTerm;
    }
    return queryObj;
};
exports.prepareQueries = prepareQueries;
