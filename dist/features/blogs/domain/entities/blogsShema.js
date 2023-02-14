"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogSchema = void 0;
const mongoose_1 = require("mongoose");
const db_1 = require("../../../../db");
;
exports.blogSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    websiteUrl: { type: String, required: true },
    createdAt: { type: String, required: true }
});
exports.blogSchema.static('makeBlog', function makeBlog(name, description, websiteUrl) {
    return new db_1.BlogModel({
        name: name,
        description: description,
        websiteUrl: websiteUrl,
        createdAt: new Date().toISOString()
    });
});
exports.blogSchema.method('updateBlog', function updateBlog(name, description, websiteUrl) {
    this.name = name;
    this.description = description;
    this.websiteUrl = websiteUrl;
});
