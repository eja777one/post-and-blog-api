import { ObjectID } from 'bson';
import {
  BlogDBModel,
  CommentDBModel,
  PostDBModel,
  TokensMetaDBModel,
  UserDBModel,
  usersRequestDBModel
} from '../models';
import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config()

export const mongoUri = process.env.mongoURI || "mongodb://0.0.0.0:27017";

if (!mongoUri) {
  throw new Error('DB url does not found');
};

// const client = new MongoClient(mongoUri);

// const db = client.db('platform');
// const db = client.db();

// export const postsCollection = db.collection<PostDBModel>('posts');
// export const blogsCollection = db.collection<BlogDBModel>('blogs');
// export const usersCollection = db.collection<UserDBModel>('users');
// export const tokensMetaCollection = db.collection<TokensMetaDBModel>('tokensMeta');
// export const commentsCollection = db.collection<CommentDBModel>('comments');
// export const usersRequestCollection = db.collection<usersRequestDBModel>('usersRequest');

const postSchema = new mongoose.Schema<PostDBModel>({
  title: { type: String, required: true },
  shortDescription: { type: String, required: true },
  content: { type: String, required: true },
  blogId: { type: String, required: true },
  blogName: { type: String, required: true },
  createdAt: { type: String, required: true }
});

export const PostModel = mongoose.model('posts', postSchema);

const blogSchema = new mongoose.Schema<BlogDBModel>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  websiteUrl: { type: String, required: true },
  createdAt: { type: String, required: true }
});

export const BlogModel = mongoose.model('blogs', blogSchema);

const userSchema = new mongoose.Schema<UserDBModel>({
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

export const UserModel = mongoose.model('users', userSchema);

const tokensMetaSchema = new mongoose.Schema<TokensMetaDBModel>({
  createdAt: { type: String, required: true },
  expiredAt: { type: String, required: true },
  deviceId: { type: String, required: true },
  ip: { type: String, required: true },
  deviceName: { type: String, required: true },
  userId: { type: String, required: true }
});

export const tokensMetaModel = mongoose.model('tokensMeta', tokensMetaSchema);

const commentSchema = new mongoose.Schema<CommentDBModel>({
  content: { type: String, required: true },
  userId: { type: String, required: true },
  userLogin: { type: String, required: true },
  createdAt: { type: String, required: true },
  postId: { type: String, required: true }
});

export const CommentModel = mongoose.model('comments', commentSchema);

const usersRequestSchema = new mongoose.Schema<usersRequestDBModel>({
  ip: { type: String, required: true },
  url: { type: String, required: true },
<<<<<<< HEAD
  createdAt: { type: Date, required: true }
  // createdAt: { type: Number, required: true }
=======
  createdAt: { type: String, required: true }
>>>>>>> parent of 1308791 (fix 429 response)
});

export const UsersRequestModel = mongoose
  .model('usersRequest', usersRequestSchema);

const passwordsRecoverySchema = new mongoose.Schema({
  userId: { type: ObjectID, required: true },
  passwordRecoveryCode: { type: String, required: true },
  createdAt: { type: String, required: true },
  expiredAt: { type: String, required: true },
});

export const PasswordsRecoveryModel = mongoose
  .model('passwordsRecovery', passwordsRecoverySchema);

export async function runDb() {
  try {
    // Connect the client to the server
    // await client.connect();
    await mongoose.connect(mongoUri);
    // Establish and verify connection
    // await client.db('products').command({ ping: 1 });
    console.log('Connection succesfully to mongo server');
  } catch (error) {
    console.log('Can\' connect to Db');
    // Ensure that the client will close when you finish/error
    // await client.close();
    await mongoose.disconnect();
  };
}

