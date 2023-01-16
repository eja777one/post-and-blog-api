import { usersQueryRepository } from './../../src/repositories/05.usersQueryRepository';
import request from "supertest";
import { app } from "../../src/app";
import { HTTP } from "../../src/models";
import { badLoginBody, badLoginBody2, badRegEmailResending, badUserInput1, codeErrorResult, loginInput1, token1, URL, userErrorResult, userInput1 } from './dataForTests';
import { ObjectID } from 'bson';

let user_01: any;
let token_01 = { ...token1 };

describe(`${URL}/auth`, () => {
  beforeAll(async () => {
    await request(app).delete(`${URL}/testing/all-data`);
  });

  // TEST #5.1
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

  // TEST #5.2
  it('Create User_01. Status 400', async () => {
    await request(app)
      .post(`${URL}/auth/registration`)
      .send(badUserInput1)
      .expect(HTTP.BAD_REQUEST_400, userErrorResult);
  });

  // TEST #5.3
  it('Create User_01. Status 204', async () => {
    const response = await request(app)
      .post(`${URL}/auth/registration`)
      .send(userInput1)

    const user = await usersQueryRepository.getDbUser(userInput1.email);

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.NO_CONTENT_204);
    expect(user).toStrictEqual({
      _id: expect.any(ObjectID),
      login: userInput1.login,
      email: userInput1.email,
      createdAt: expect.any(String),
      confirmationCode: expect.any(String),
      expirationDate: expect.any(Date),
      isConfirmed: false,
      sentEmailsCount: 1
    });

    user_01 = { ...user };
  });

  // TEST #5.4
  it('Create another email confirm to User_01. Status 400', async () => {
    await request(app)
      .post(`${URL}/auth/registration-email-resending`)
      .send(badRegEmailResending)
      .expect(HTTP.BAD_REQUEST_400, userErrorResult);
  });

  // TEST #5.5
  it('Create another email confirm to User_01. Status 204', async () => {
    const response = await request(app)
      .post(`${URL}/auth/registration-email-resending`)
      .send({ email: userInput1.email })

    const user = await usersQueryRepository.getDbUser(userInput1.email);

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.NO_CONTENT_204);
    expect(user).toStrictEqual({
      _id: expect.any(ObjectID),
      login: userInput1.login,
      email: userInput1.email,
      createdAt: expect.any(String),
      confirmationCode: expect.any(String),
      expirationDate: expect.any(Date),
      isConfirmed: false,
      sentEmailsCount: 2
    });

    user_01 = { ...user };
  });

  // TEST #5.6
  it('LOGIN User_01. Status 401', async () => {
    await request(app)
      .post(`${URL}/auth/login`)
      .send(loginInput1)
      .expect(HTTP.UNAUTHORIZED_401);
  });

  // TEST #5.7
  it('Create activation to User_01. Status 400', async () => {
    await request(app)
      .post(`${URL}/auth/registration-confirmation`)
      .send({ code: 'Bad confirmation code' })
      .expect(HTTP.BAD_REQUEST_400);
  });

  // TEST #5.8
  it('Create activation to User_01. Status 204', async () => {
    const response = await request(app)
      .post(`${URL}/auth/registration-confirmation`)
      .send({ code: user_01.confirmationCode })

    const user = await usersQueryRepository.getDbUser(userInput1.email);

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.NO_CONTENT_204);
    expect(user).toStrictEqual({
      _id: expect.any(ObjectID),
      login: userInput1.login,
      email: userInput1.email,
      createdAt: expect.any(String),
      confirmationCode: expect.any(String),
      expirationDate: expect.any(Date),
      isConfirmed: true,
      sentEmailsCount: 2
    });

    user_01 = { ...user };
  });

  // TEST #5.9
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

  // TEST #5.10
  it('LOGIN User_01. Status 400', async () => {
    await request(app)
      .post(`${URL}/auth/login`)
      .send(badLoginBody)
      .expect(HTTP.BAD_REQUEST_400);
  });

  // TEST #5.11
  it('LOGIN User_01. Status 401', async () => {
    await request(app)
      .post(`${URL}/auth/login`)
      .send(badLoginBody2)
      .expect(HTTP.UNAUTHORIZED_401);
  });

  // TEST #5.12
  it('Get info about User_01. Status 200', async () => {
    await request(app)
      .get(`${URL}/auth/me`)
      .set('Authorization', `Bearer ${token_01.accessToken}`)
      .expect(HTTP.OK_200, {
        email: user_01.email,
        login: user_01.login,
        userId: user_01._id.toString()
      });
  });

  // TEST #5.13
  it('Get info about User_01. Status 401', async () => {
    await request(app)
      .get(`${URL}/auth/me`)
      .set('Authorization', `Bearer token_01.accessToken`)
      .expect(HTTP.UNAUTHORIZED_401);
  });
});