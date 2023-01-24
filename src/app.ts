import express from "express";
import { authRouter } from './routers/01.authRouter';
import { blogsRouter } from './routers/02.blogsRouter';
import { commentsRouter } from './routers/03.commentsRouter';
import { postsRouter } from './routers/04.postsRouter';
import { testsRouter } from './routers/06.testsRouter';
import { usersRouter } from './routers/05.usersRouter';
import { securityDeviceRouter } from './routers/07.securityDevicesRouter';
import { UserViewModel } from './models';
import { allowedMethods } from './middlewares/allowedMethodsMware';
import cookieParser from 'cookie-parser';
import useragent from 'express-useragent';
import * as dotenv from 'dotenv';
dotenv.config()

export const app = express();
export const port = process.env.PORT || 3003;

declare global {
  namespace Express {
    interface Request {
      user: UserViewModel | null
    }
  }
};

app.set('trust proxy', true);

const jsonBodyMiddleware = express.json();

app.use(jsonBodyMiddleware);
app.use(allowedMethods);
app.use(cookieParser('cookie'));
app.use(useragent.express());

app.use('/hometask_09/api/auth', authRouter);
app.use('/hometask_09/api/blogs', blogsRouter);
app.use('/hometask_09/api/comments', commentsRouter);
app.use('/hometask_09/api/posts', postsRouter);
app.use('/hometask_09/api/users', usersRouter);
app.use('/hometask_09/api/security/devices', securityDeviceRouter);
app.use('/hometask_09/api/testing/all-data', testsRouter);