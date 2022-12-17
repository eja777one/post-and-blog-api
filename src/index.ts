import express, { Request, Response } from 'express';
import { postsRepository } from './repositories/posts-db-repository';
import { blogRepository } from './repositories/blogs-db-repository';
import { postsRouter } from './routers/posts-router';
import { blogsRouter } from './routers/blogs-router';
import { HTTP } from './HTTPStatusCodes';
import { runDb } from './repositories/db';

export const app = express();
const port = process.env.PORT || 3003;

const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware);

app.use('/hometask_03/api/blogs', blogsRouter);

app.use('/hometask_03/api/posts', postsRouter);

app.delete('/hometask_03/api/testing/all-data', async (req: Request, res: Response) => {
  await blogRepository.deleteAll();
  await postsRepository.deleteAll();
  res.sendStatus(HTTP.NO_CONTENT_204); // TEST #1.1
});

const startApp = async () => {
  await runDb();
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}

startApp()