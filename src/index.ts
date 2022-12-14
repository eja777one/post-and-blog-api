import express, { Request, Response } from 'express';
import { postsRepository } from './repositories/posts-repository';
import { blogRepository } from './repositories/blogs-repository';
import { postsRouter } from './routers/posts-router';
import { blogsRouter } from './routers/blogs-router';
import { HTTP } from './HTTPStatusCodes';

export const app = express();
const port = process.env.PORT || 3003;

const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware);

app.use('/ht_02/api/blogs', blogsRouter);

app.use('/ht_02/api/posts', postsRouter);

app.delete('/ht_02/apr/testing/all-data', (req: Request, res: Response) => {
  blogRepository.deleteAll();
  postsRepository.deleteAll();
  res.sendStatus(HTTP.NO_CONTENT_204); // TEST #1.1
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});