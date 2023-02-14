"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentSchema = void 0;
const db_1 = require("./../../../../db");
const mongoose_1 = require("mongoose");
;
exports.commentSchema = new mongoose_1.Schema({
    content: { type: String, required: true },
    userId: { type: String, required: true },
    userLogin: { type: String, required: true },
    createdAt: { type: String, required: true },
    postId: { type: String, required: true },
    likesCount: { type: Number, required: true },
    dislikesCount: { type: Number, required: true },
    usersLikeStatus: []
});
exports.commentSchema.static('makeComment', function makeComment(content, userId, userLogin, postId) {
    return new db_1.CommentModel({
        content: content,
        userId: userId,
        userLogin: userLogin,
        createdAt: new Date().toISOString(),
        postId: postId,
        likesCount: 0,
        dislikesCount: 0,
        usersLikeStatus: []
    });
});
exports.commentSchema.method('updateComment', function updateComment(content) {
    this.content = content;
});
exports.commentSchema.method('changeLikeStatus', function changeLikeStatus(likeStatus, userId) {
    let currentStatus = 'None';
    let findUsersLike = this.usersLikeStatus.find((el) => el.userId === userId);
    if (findUsersLike)
        currentStatus = findUsersLike.likeStatus;
    if (currentStatus === likeStatus)
        return false;
    if (currentStatus === 'None') {
        if (likeStatus === 'Like')
            this.likesCount += 1;
        if (likeStatus === 'Dislike')
            this.dislikesCount += 1;
    }
    ;
    if (currentStatus === 'Like') {
        if (likeStatus === 'None')
            this.likesCount -= 1;
        if (likeStatus === 'Dislike') {
            this.likesCount -= 1;
            this.dislikesCount += 1;
        }
        ;
    }
    ;
    if (currentStatus === 'Dislike') {
        if (likeStatus === 'None')
            this.dislikesCount -= 1;
        if (likeStatus === 'Like') {
            this.likesCount += 1;
            this.dislikesCount -= 1;
        }
        ;
    }
    ;
    if (!findUsersLike)
        this.usersLikeStatus.push({ userId, likeStatus });
    else {
        let j = 0;
        for (let i = 0; i < this.usersLikeStatus.length; i++) {
            if (this.usersLikeStatus[i].userId === userId)
                j = i;
        }
        ;
        this.usersLikeStatus.splice(j, 1, { userId, likeStatus });
    }
    ;
    return true;
});
