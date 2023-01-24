import request from "supertest";
import { app } from "../../src/app";
import { HTTP } from "../../src/models";
import { URL } from './00.dataForTests';

describe(`${URL}/testing/all-data`, () => {
  // TEST #1.1
  it('should delete all data and return empty array', async () => {
    await request(app)
      .delete(`${URL}/testing/all-data`)
      .expect(HTTP.NO_CONTENT_204);
  });
});