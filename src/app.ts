import express from 'express';
import { authRouter } from './routers/01.authRouter';
import { blogsRouter } from './routers/02.blogsRouter';
import { commentsRouter } from './routers/03.commentsRouter';
import { postsRouter } from './routers/04.postsRouter';
import { testsRouter } from './routers/06.testsRouter';
import { usersRouter } from './routers/05.usersRouter';
import { UserViewModel } from './models';

export const app = express();
export const port = process.env.PORT || 3003;

declare global {
  namespace Express {
    interface Request {
      user: UserViewModel | null
    }
  }
};

const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware);
app.set('trust proxy', true);

app.use('/hometask_07/api/auth', authRouter);
app.use('/hometask_07/api/blogs', blogsRouter);
app.use('/hometask_07/api/comments', commentsRouter);
app.use('/hometask_07/api/posts', postsRouter);
app.use('/hometask_07/api/users', usersRouter);
app.use('/hometask_07/api/testing/all-data', testsRouter);