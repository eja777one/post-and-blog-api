import {
  BlogDBModel, PostDBModel, CommentDBModel, UserDBModel,
  TokensMetaDBModel, PasswordDataDBModel
} from './models';
import { IPasswordDataDBModel, passwordsRecoverySchema }
  from './features/users/domain/entities/passwordsRecoverySchema';
import { usersRequestSchema }
  from './features/users/domain/entities/usersRequestSchema';
import { ITokensMetaDBModel, tokensMetaSchema }
  from './features/devices/domain/entities/tokensSchema';
import { IUserDBModel, userSchema }
  from './features/users/domain/entities/usersSchema';
import { commentSchema, ICommentDBModel }
  from './features/comments/domains/entities/commentsSchema';
import { postSchema, IPostDBModel }
  from './features/posts/domains/entities/postsSchema';
import { blogSchema, IBlogDBModel }
  from './features/blogs/domain/entities/blogsShema';
// import { MongoClient, ObjectId } from 'mongodb';
import mongoose, { model } from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config()

export const mongoUri = process.env.mongoURI || "mongodb://0.0.0.0:27017";

if (!mongoUri) throw new Error('DB url does not found');

// const client = new MongoClient(mongoUri);

// const db = client.db('platform');
// const db = client.db();

// export const postsCollection = db.collection<PostDBModel>('posts');
// export const blogsCollection = db.collection<BlogDBModel>('blogs');
// export const usersCollection = db.collection<UserDBModel>('users');
// export const tokensMetaCollection = db.collection<TokensMetaDBModel>('tokensMeta');
// export const commentsCollection = db.collection<CommentDBModel>('comments');
// export const usersRequestCollection = db.collection<usersRequestDBModel>('usersRequest');

export const PostModel = model<PostDBModel, IPostDBModel>('posts', postSchema);

export const BlogModel = model<BlogDBModel, IBlogDBModel>('blogs', blogSchema);

export const UserModel = model<UserDBModel, IUserDBModel>('users', userSchema);

export const tokensMetaModel =
  model<TokensMetaDBModel, ITokensMetaDBModel>('tokensMeta', tokensMetaSchema);

export const CommentModel =
  model<CommentDBModel, ICommentDBModel>('comments', commentSchema);

export const UsersRequestModel = model('usersRequest', usersRequestSchema);

export const PasswordsRecoveryModel =
  model<PasswordDataDBModel, IPasswordDataDBModel>('passwordsRecovery', passwordsRecoverySchema);

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

