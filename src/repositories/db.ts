import { BlogDBModel, PostDBModel, UserDBModel } from './../models';
import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
dotenv.config()

const mongoUri = process.env.mongoURI;

if (!mongoUri) {
  throw new Error('DB url does not found');
};

const client = new MongoClient(mongoUri);

// const db = client.db('platform');
const db = client.db();

export const postsCollection = db.collection<PostDBModel>('posts');
export const blogsCollection = db.collection<BlogDBModel>('blogs');
export const usersCollection = db.collection<UserDBModel>('users');

export async function runDb() {
  try {
    // Connect the client to the server
    await client.connect();
    // Establish and verify connection
    // await client.db('products').command({ ping: 1 });
    console.log('Connection succesfully to mongo server');
  } catch (error) {
    console.log('Can\' connect to Db');
    // Ensure that the client will close when you finish/error
    await client.close();
  };
}

