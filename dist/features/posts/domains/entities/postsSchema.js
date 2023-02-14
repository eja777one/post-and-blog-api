"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postSchema = void 0;
const mongoose_1 = require("mongoose");
const db_1 = require("../../../../db");
;
;
exports.postSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    content: { type: String, required: true },
    blogId: { type: String, required: true },
    blogName: { type: String, required: true },
    createdAt: { type: String, required: true },
    likesCount: { type: Number, required: true },
    dislikesCount: { type: Number, required: true },
    usersLikeStatus: { type: [], required: true },
});
exports.postSchema.static('makePost', function makePost(title, shortDescription, content, blogId, blogName) {
    return new db_1.PostModel({
        title: title,
        shortDescription: shortDescription,
        content: content,
        blogId: blogId,
        blogName: blogName,
        createdAt: new Date().toISOString(),
        likesCount: 0,
        dislikesCount: 0,
        usersLikeStatus: []
    });
});
exports.postSchema.method('updatePost', function updatePostupdatePost(title, shortDescription, content, blogId, blogName) {
    this.title = title;
    this.shortDescription = shortDescription;
    this.content = content;
    this.blogId = blogId;
    this.blogName = blogName;
});
exports.postSchema.method('changeLikeStatus', function changeLikeStatus(likeStatus, userId, userLogin) {
    let currentStatus = 'None';
    let findUsersLike = this.usersLikeStatus.find((el) => el.userId === userId);
    console.log(findUsersLike);
    if (findUsersLike)
        currentStatus = findUsersLike.status;
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
    const likesData = {
        addedAt: new Date().toISOString(),
        userId: userId,
        login: userLogin,
        status: likeStatus
    };
    if (!findUsersLike) {
        this.usersLikeStatus.push(likesData);
    }
    else {
        let j = 0;
        let addedAt = '';
        for (let i = 0; i < this.usersLikeStatus.length; i++) {
            if (this.usersLikeStatus[i].userId === userId) {
                j = i;
                addedAt = this.usersLikeStatus[i].addedAt;
            }
        }
        ;
        this.usersLikeStatus.splice(j, 1, Object.assign(Object.assign({}, likesData), { addedAt }));
        //STOP HERE
    }
    ;
    // console.log(this)
    return true;
});
