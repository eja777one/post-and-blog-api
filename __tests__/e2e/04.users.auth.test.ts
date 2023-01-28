import mongoose from "mongoose";
import { mongoUri } from "../../src/repositories/00.db";
import request from "supertest";
import { app } from "../../src/app";
import { HTTP } from "../../src/models";
import {
  badLoginBody,
  badLoginBody2,
  badUserInput1,
  loginInput1,
  token1,
  URL,
  user1,
  user2,
  userErrorResult,
  userInput1,
  userInput2
} from './00.dataForTests';

let user_01 = { ...user1 };
let user_02 = { ...user2 };
let token_01 = { ...token1 };

describe(`${URL}/users`, () => {
  beforeAll(async () => {
    await mongoose.connect(mongoUri, { dbName: 'test' })
    await request(app).delete(`${URL}/testing/all-data`)
  });

  // TEST #4.1
  it('GET Users. Status 401', async () => {
    await request(app)
      .get(`${URL}/users`)
      .auth('admin', 'admin', { type: 'basic' })
      .expect(HTTP.UNAUTHORIZED_401);
  });

  // TEST #4.2
  it('GET Users. Status 200', async () => {
    await request(app)
      .get(`${URL}/users`)
      .auth('admin', 'qwerty', { type: 'basic' })
      .expect(HTTP.OK_200, {
        pagesCount: 0,
        page: 1,
        pageSize: 10,
        totalCount: 0,
        items: []
      });
  });

  // TEST #4.3
  it('Create User_01 (unauthorized). Status 401', async () => {
    await request(app)
      .post(`${URL}/users`)
      .auth('admin', 'admin', { type: 'basic' })
      .send(userInput1)
      .expect(HTTP.UNAUTHORIZED_401);
  });

  // TEST #4.4
  it('Create User_01 (bad request). Status 400', async () => {
    await request(app)
      .post(`${URL}/users`)
      .auth('admin', 'qwerty', { type: 'basic' })
      .send(badUserInput1)
      .expect(HTTP.BAD_REQUEST_400, userErrorResult);
  });

  // TEST #4.5
  it('Create User_01. Status 201', async () => {
    const response = await request(app)
      .post(`${URL}/users`)
      .auth('admin', 'qwerty', { type: 'basic' })
      .send(userInput1)

    const user = response.body;

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.CREATED_201);
    expect(user).toStrictEqual({
      id: expect.any(String),
      login: userInput1.login,
      email: userInput1.email,
      createdAt: expect.any(String)
    });

    user_01 = { ...user };
  });

  // TEST #4.6
  it('Create User_02. Status 201', async () => {
    const response = await request(app)
      .post(`${URL}/users`)
      .auth('admin', 'qwerty', { type: 'basic' })
      .send(userInput2)

    const user = response.body;

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.CREATED_201);
    expect(user).toStrictEqual({
      id: expect.any(String),
      login: userInput2.login,
      email: userInput2.email,
      createdAt: expect.any(String)
    });

    user_02 = { ...user };
  });

  // TEST #4.7
  it('GET Users. Status 200', async () => {
    await request(app)
      .get(`${URL}/users`)
      .auth('admin', 'qwerty', { type: 'basic' })
      .expect(HTTP.OK_200, {
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 2,
        items: [user_01, user_02]
      });
  });

  // TEST #4.8
  it('DELETE User10. Status 404', async () => {
    await request(app)
      .delete(`${URL}/users/10`)
      .auth('admin', 'qwerty', { type: 'basic' })
      .expect(HTTP.NOT_FOUND_404);
  });

  // TEST #4.9
  it('DELETE User_02. Status 401', async () => {
    await request(app)
      .delete(`${URL}/users/${user_02.id}`)
      .auth('admin', 'admin', { type: 'basic' })
      .expect(HTTP.UNAUTHORIZED_401);
  });

  // TEST #4.10
  it('DELETE User_02. Status 204', async () => {
    await request(app)
      .delete(`${URL}/users/${user_02.id}`)
      .auth('admin', 'qwerty', { type: 'basic' })
      .expect(HTTP.NO_CONTENT_204);
  });

  // TEST #4.11
  it('LOGIN User_01. Status 200', async () => {
    const response = await request(app)
      .post(`${URL}/auth/login`)
      .send(loginInput1)

    const accessToken = response.body;

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.OK_200);
    expect(accessToken).toStrictEqual({
      accessToken: expect.any(String),
    });

    token_01 = { ...accessToken };
  });

  // TEST #4.12
  it('LOGIN User_01. Status 400', async () => {
    await request(app)
      .post(`${URL}/auth/login`)
      .send(badLoginBody)
      .expect(HTTP.BAD_REQUEST_400);
  });

  // TEST #4.13
  it('LOGIN User_01. Status 401', async () => {
    await request(app)
      .post(`${URL}/auth/login`)
      .send(badLoginBody2)
      .expect(HTTP.UNAUTHORIZED_401);
  });

  // TEST #4.14
  it('Get info about User_01. Status 200', async () => {
    await request(app)
      .get(`${URL}/auth/me`)
      .set('Authorization', `Bearer ${token_01.accessToken}`)
      .expect(HTTP.OK_200, {
        email: user_01.email,
        login: user_01.login,
        userId: user_01.id
      });
  });

  // TEST #4.15
  it('Get info about User_01. Status 401', async () => {
    await request(app)
      .get(`${URL}/auth/me`)
      .set('Authorization', `Bearer token_01.accessToken`)
      .expect(HTTP.UNAUTHORIZED_401);
  });

  // TEST #4.16
  it('DELETE User_01. Status 204', async () => {
    await request(app)
      .delete(`${URL}/users/${user_01.id}`)
      .auth('admin', 'qwerty', { type: 'basic' })
      .expect(HTTP.NO_CONTENT_204);
  });

  // TEST #4.17
  it('GET Users. Status 200', async () => {
    await request(app)
      .get(`${URL}/users`)
      .auth('admin', 'qwerty', { type: 'basic' })
      .expect(HTTP.OK_200, {
        pagesCount: 0,
        page: 1,
        pageSize: 10,
        totalCount: 0,
        items: []
      });
  });
});