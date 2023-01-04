import express from 'express';
import { UserViewModel } from './models';
import { authRouter } from './routers/auth-router';
import { blogsRouter } from './routers/blogs-router';
import { commentsRouter } from './routers/comments-router';
import { postsRouter } from './routers/posts-router';
import { testsRouter } from './routers/tests-router';
import { usersRouter } from './routers/users-router';

export const app = express();
export const port = process.env.PORT || 3003;

declare global {
  namespace Express {
    interface Request {
      user: UserViewModel | null
    }
  }
}

const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware);

app.use('/hometask_06/api/auth', authRouter);
app.use('/hometask_06/api/blogs', blogsRouter);
app.use('/hometask_06/api/comments', commentsRouter);
app.use('/hometask_06/api/posts', postsRouter);
app.use('/hometask_06/api/users', usersRouter);
app.use('/hometask_06/api/testing/all-data', testsRouter);