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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
exports.runDb = exports.PasswordsRecoveryModel = exports.UsersRequestModel = exports.CommentModel = exports.tokensMetaModel = exports.UserModel = exports.BlogModel = exports.PostModel = exports.mongoUri = void 0;
const bson_1 = require("bson");
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
exports.mongoUri = process.env.mongoURI || "mongodb://0.0.0.0:27017";
if (!exports.mongoUri) {
    throw new Error('DB url does not found');
}
;
// const client = new MongoClient(mongoUri);
// const db = client.db('platform');
// const db = client.db();
// export const postsCollection = db.collection<PostDBModel>('posts');
// export const blogsCollection = db.collection<BlogDBModel>('blogs');
// export const usersCollection = db.collection<UserDBModel>('users');
// export const tokensMetaCollection = db.collection<TokensMetaDBModel>('tokensMeta');
// export const commentsCollection = db.collection<CommentDBModel>('comments');
// export const usersRequestCollection = db.collection<usersRequestDBModel>('usersRequest');
const postSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    content: { type: String, required: true },
    blogId: { type: String, required: true },
    blogName: { type: String, required: true },
    createdAt: { type: String, required: true }
});
exports.PostModel = mongoose_1.default.model('posts', postSchema);
const blogSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    websiteUrl: { type: String, required: true },
    createdAt: { type: String, required: true }
});
exports.BlogModel = mongoose_1.default.model('blogs', blogSchema);
const userSchema = new mongoose_1.default.Schema({
    accountData: {
        login: { type: String, required: true },
        email: { type: String, required: true },
        passwordHash: { type: String, required: true },
        passwordSalt: { type: String, required: true },
        createdAt: { type: String, required: true }
    },
    emailConfirmation: {
        confirmationCode: { type: String, required: true },
        expirationDate: { type: Date, required: true },
        isConfirmed: { type: Boolean, required: true },
        sentEmails: [
            { sentDate: { type: Date, required: true } }
        ]
    },
    registrationData: {
        ip: { type: String }
    }
});
exports.UserModel = mongoose_1.default.model('users', userSchema);
const tokensMetaSchema = new mongoose_1.default.Schema({
    createdAt: { type: String, required: true },
    expiredAt: { type: String, required: true },
    deviceId: { type: String, required: true },
    ip: { type: String, required: true },
    deviceName: { type: String, required: true },
    userId: { type: String, required: true }
});
exports.tokensMetaModel = mongoose_1.default.model('tokensMeta', tokensMetaSchema);
const commentSchema = new mongoose_1.default.Schema({
    content: { type: String, required: true },
    userId: { type: String, required: true },
    userLogin: { type: String, required: true },
    createdAt: { type: String, required: true },
    postId: { type: String, required: true }
});
exports.CommentModel = mongoose_1.default.model('comments', commentSchema);
const usersRequestSchema = new mongoose_1.default.Schema({
    ip: { type: String, required: true },
    url: { type: String, required: true },
    createdAt: { type: String, required: true }
});
exports.UsersRequestModel = mongoose_1.default
    .model('usersRequest', usersRequestSchema);
const passwordsRecoverySchema = new mongoose_1.default.Schema({
    userId: { type: bson_1.ObjectID, required: true },
    passwordRecoveryCode: { type: String, required: true },
    createdAt: { type: String, required: true },
    expiredAt: { type: String, required: true },
});
exports.PasswordsRecoveryModel = mongoose_1.default
    .model('passwordsRecovery', passwordsRecoverySchema);
function runDb() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Connect the client to the server
            // await client.connect();
            yield mongoose_1.default.connect(exports.mongoUri);
            // Establish and verify connection
            // await client.db('products').command({ ping: 1 });
            console.log('Connection succesfully to mongo server');
        }
        catch (error) {
            console.log('Can\' connect to Db');
            // Ensure that the client will close when you finish/error
            // await client.close();
            yield mongoose_1.default.disconnect();
        }
        ;
    });
}
exports.runDb = runDb;
