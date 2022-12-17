import { BlogViewModel } from './../models';
import { MongoClient } from 'mongodb';
import { PostViewModel } from '../models';

const mongoUri = process.env.mongoURI
  || 'mongodb+srv://admin:admin@cluster0.3koqkkh.mongodb.net/?retryWrites=true&w=majority';

const client = new MongoClient(mongoUri);

const db = client.db('platform');

export const postsCollection = db.collection<PostViewModel>('posts');
export const blogsCollection = db.collection<BlogViewModel>('blogs');

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

