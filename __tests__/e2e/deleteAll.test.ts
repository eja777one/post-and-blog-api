import request from "supertest";
import { app } from "../../src/app";
import { HTTP } from "../../src/models";

describe('/hometask_06/apr/testing/all-data', () => {
  // TEST #1.1
  it('should delete all data and return empty array', async () => {
    await request(app)
      .delete('/hometask_06/api/testing/all-data')
      .expect(HTTP.NO_CONTENT_204);
  });
});