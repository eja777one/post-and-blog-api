import express from 'express';
import { blogsRouter } from "./routers/blogs-router";
import { postsRouter } from "./routers/posts-router";
import { testsRouter } from "./routers/tests-router";

export const app = express();
export const port = process.env.PORT || 3003;

const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware);

app.use('/hometask_04/api/blogs', blogsRouter);
app.use('/hometask_04/api/posts', postsRouter);
app.use('/hometask_04/api/testing/all-data', testsRouter);