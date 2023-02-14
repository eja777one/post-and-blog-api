import request from "supertest";
import { app } from "../../src/app";
import { HTTP } from "../../src/models";
import { URL } from './00.dataForTests';
import mongoose from "mongoose";
import { mongoUri } from "../../src/db"; 


describe(`${URL}/testing/all-data`, () => {
  beforeAll(async () => {
    await mongoose.connect(mongoUri, { dbName: 'test' })
  }); // blogs = [];

  // TEST #1.1
  it('should delete all data and return empty array', async () => {
    await request(app)
      .delete(`${URL}/testing/all-data`)
      .expect(HTTP.NO_CONTENT_204);
  });
});