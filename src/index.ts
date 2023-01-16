import { runDb } from './repositories/00.db';
import { app, port } from './app';

const startApp = async () => {
  await runDb();
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
};

startApp();