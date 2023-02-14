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
Object.defineProperty(exports, "__esModule", { value: true });
exports.runDb = exports.PasswordsRecoveryModel = exports.UsersRequestModel = exports.CommentModel = exports.tokensMetaModel = exports.UserModel = exports.BlogModel = exports.PostModel = exports.mongoUri = void 0;
const passwordsRecoverySchema_1 = require("./features/users/domain/entities/passwordsRecoverySchema");
const usersRequestSchema_1 = require("./features/users/domain/entities/usersRequestSchema");
const tokensSchema_1 = require("./features/devices/domain/entities/tokensSchema");
const usersSchema_1 = require("./features/users/domain/entities/usersSchema");
const commentsSchema_1 = require("./features/comments/domains/entities/commentsSchema");
const postsSchema_1 = require("./features/posts/domains/entities/postsSchema");
const blogsShema_1 = require("./features/blogs/domain/entities/blogsShema");
// import { MongoClient, ObjectId } from 'mongodb';
const mongoose_1 = __importStar(require("mongoose"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
exports.mongoUri = process.env.mongoURI || "mongodb://0.0.0.0:27017";
if (!exports.mongoUri)
    throw new Error('DB url does not found');
// const client = new MongoClient(mongoUri);
// const db = client.db('platform');
// const db = client.db();
// export const postsCollection = db.collection<PostDBModel>('posts');
// export const blogsCollection = db.collection<BlogDBModel>('blogs');
// export const usersCollection = db.collection<UserDBModel>('users');
// export const tokensMetaCollection = db.collection<TokensMetaDBModel>('tokensMeta');
// export const commentsCollection = db.collection<CommentDBModel>('comments');
// export const usersRequestCollection = db.collection<usersRequestDBModel>('usersRequest');
exports.PostModel = (0, mongoose_1.model)('posts', postsSchema_1.postSchema);
exports.BlogModel = (0, mongoose_1.model)('blogs', blogsShema_1.blogSchema);
exports.UserModel = (0, mongoose_1.model)('users', usersSchema_1.userSchema);
exports.tokensMetaModel = (0, mongoose_1.model)('tokensMeta', tokensSchema_1.tokensMetaSchema);
exports.CommentModel = (0, mongoose_1.model)('comments', commentsSchema_1.commentSchema);
exports.UsersRequestModel = (0, mongoose_1.model)('usersRequest', usersRequestSchema_1.usersRequestSchema);
exports.PasswordsRecoveryModel = (0, mongoose_1.model)('passwordsRecovery', passwordsRecoverySchema_1.passwordsRecoverySchema);
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
