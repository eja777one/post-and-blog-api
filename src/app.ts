import express from 'express';
import { authRouter } from './routers/auth-router';
import { blogsRouter } from './routers/blogs-router';
import { postsRouter } from './routers/posts-router';
import { testsRouter } from './routers/tests-router';
import { usersRouter } from './routers/users-router';

export const app = express();
export const port = process.env.PORT || 3003;

const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware);

app.use('/hometask_05/api/auth/login', authRouter);
app.use('/hometask_05/api/blogs', blogsRouter);
app.use('/hometask_05/api/posts', postsRouter);
app.use('/hometask_05/api/users', usersRouter);
app.use('/hometask_05/api/testing/all-data', testsRouter);