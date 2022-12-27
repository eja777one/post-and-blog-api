import request from "supertest";
import { app } from "../../src/app";
import { HTTP } from "../../src/models";

describe('/hometask_05/apr/testing/all-data', () => {
  // TEST #1.1
  it('should delete all data and return empty array', async () => {
    await request(app)
      .delete('/hometask_05/api/testing/all-data')
      .expect(HTTP.NO_CONTENT_204);
  });
});