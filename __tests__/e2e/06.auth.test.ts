import { PasswordRecoveryRepository }
  from './../../src/repositories/08.passwordsRecDBRepo';
import mongoose from "mongoose";
import { mongoUri } from "../../src/repositories/00.db";
import { UsersQueryRepository } from '../../src/repositories/05.usersQRepo';
import request from "supertest";
import { app } from "../../src/app";
import { HTTP } from "../../src/models";
import { ObjectID } from 'bson';
import {
  badLoginBody,
  badLoginBody2,
  badRegEmailResending,
  badUserInput1,
  loginInput1,
  token1,
  URL,
  userErrorResult,
  userInput1
} from './00.dataForTests';

let user_01: any;
let token_01 = { ...token1 };
let cookie: string[];

// jest.setTimeout(30000);

const passwordRecoveryRepository = new PasswordRecoveryRepository();
const usersQueryRepository = new UsersQueryRepository();

describe(`${URL}/auth`, () => {
  beforeAll(async () => {
    await mongoose.connect(mongoUri, { dbName: 'test' })
    await request(app).delete(`${URL}/testing/all-data`);
  });

  // TEST #6.1
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

  // // TEST #6.2
  // it('Create User_01. Status 429', async () => {
  //   let response = await request(app)
  //     .post(`${URL}/auth/registration`)
  //     .send(userInput1);

  //   for (let i = 0; i < 10; i++) {
  //     response = await request(app)
  //       .post(`${URL}/auth/registration`)
  //       .send(userInput1)
  //   };

  //   expect(response.status)
  //     .toBe(HTTP.TOO_MANY_REQUESTS_429);
  // });

  // TEST #6.3
  it('Create User_01. Status 400', async () => {
    await request(app)
      .post(`${URL}/auth/registration`)
      .send(badUserInput1)
      .expect(HTTP.BAD_REQUEST_400, userErrorResult);
  });

  // TEST #6.4
  it('Create User_01. Status 204', async () => {
    const response = await request(app)
      .post(`${URL}/auth/registration`)
      .send(userInput1);

    const user = await usersQueryRepository
      .getUserForTests(userInput1.email);

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
      sentEmailsCount: expect.any(Number)
    });

    user_01 = { ...user };
  });

  // // TEST #6.5
  // it('Create another email confirm to User_01. Status 429', async () => {

  //   let response = await request(app)
  //     .post(`${URL}/auth/registration-email-resending`)
  //     .send({ email: userInput1.email });

  //   for (let i = 0; i < 5; i++) {
  //     response = await request(app)
  //       .post(`${URL}/auth/registration-email-resending`)
  //       .send({ email: userInput1.email });
  //   };

  //   expect(response.status)
  //     .toBe(HTTP.TOO_MANY_REQUESTS_429);
  // });

  // TEST #6.6
  it('Create another email confirm to User_01. Status 400', async () => {
    await request(app)
      .post(`${URL}/auth/registration-email-resending`)
      .send(badRegEmailResending)
      .expect(HTTP.BAD_REQUEST_400, userErrorResult);
  });

  // TEST #6.7
  it('Create another email confirm to User_01. Status 204', async () => {
    const response = await request(app)
      .post(`${URL}/auth/registration-email-resending`)
      .send({ email: userInput1.email })

    const user = await usersQueryRepository.getUserForTests(userInput1.email);

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
      sentEmailsCount: expect.any(Number)
    });

    user_01 = { ...user };
  });

  // TEST #6.8
  it('LOGIN User_01. Status 401', async () => {
    await request(app)
      .post(`${URL}/auth/login`)
      .send(loginInput1)
      .expect(HTTP.UNAUTHORIZED_401);
  });

  // // TEST #6.9
  // it('Create activation to User_01. Status 429', async () => { });

  // TEST #6.10
  it('Create activation to User_01. Status 400', async () => {
    await request(app)
      .post(`${URL}/auth/registration-confirmation`)
      .send({ code: 'Bad confirmation code' })
      .expect(HTTP.BAD_REQUEST_400);
  });

  // TEST #6.11
  it('Create activation to User_01. Status 204', async () => {
    const response = await request(app)
      .post(`${URL}/auth/registration-confirmation`)
      .send({ code: user_01.confirmationCode })

    const user = await usersQueryRepository.getUserForTests(userInput1.email);

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

  // // TEST #6.12
  // it('LOGIN User_01. Status 429', async () => { });

  // TEST #6.13
  it('LOGIN User_01. Status 401', async () => {
    await request(app)
      .post(`${URL}/auth/login`)
      .send(badLoginBody2)
      .expect(HTTP.UNAUTHORIZED_401);
  });

  // TEST #6.14
  it('LOGIN User_01. Status 400', async () => {
    await request(app)
      .post(`${URL}/auth/login`)
      .send(badLoginBody)
      .expect(HTTP.BAD_REQUEST_400);
  });

  // TEST #6.15
  it('LOGIN User_01. Status 200', async () => {
    const response = await request(app)
      .post(`${URL}/auth/login`)
      .send(loginInput1)

    const accessToken = response.body;

    cookie = response.get('Set-Cookie');
    // cookie = response.get('Set-Cookie')[0].split('; ')[0].split('=')[1];

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.OK_200);
    expect(accessToken).toStrictEqual({
      accessToken: expect.any(String),
    });

    token_01 = { ...accessToken };
  });

  // TEST #6.16
  it('Refresh token to User_01. Status 401', async () => {
    await request(app)
      .post(`${URL}/auth/refresh-token`)
      .set('Cookie', '123')
      .expect(HTTP.UNAUTHORIZED_401);
  });

  // TEST #6.17
  it('Refresh token to User_01. Status 200', async () => {
    const response = await request(app)
      .post(`${URL}/auth/refresh-token`)
      .set('Cookie', cookie);

    cookie = response.get('Set-Cookie');

    const accessToken = response.body;

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.OK_200);
    expect(accessToken).toStrictEqual({
      accessToken: expect.any(String),
    });

    token_01 = { ...accessToken };
  });

  // TEST #6.18
  it('Get info about User_01. Status 401', async () => {
    await request(app)
      .get(`${URL}/auth/me`)
      .set('Authorization', `Bearer token_01.accessToken`)
      .expect(HTTP.UNAUTHORIZED_401);
  });

  // TEST #6.19
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

  // TEST #6.20
  it('Logout User_01. Status 401', async () => {
    const response = await request(app)
      .post(`${URL}/auth/logout`)
      .set('Cookie', '123')
      .expect(HTTP.UNAUTHORIZED_401);
  });

  // TEST #6.21
  it('Logout User_01. Status 200', async () => {
    const response = await request(app)
      .post(`${URL}/auth/logout`)
      .set('Cookie', cookie)
      .expect(HTTP.NO_CONTENT_204);
  });

  // TEST #6.22
  it('Refresh token to User_01. Status 401', async () => {
    await request(app)
      .post(`${URL}/auth/refresh-token`)
      .set('Cookie', cookie)
      .expect(HTTP.UNAUTHORIZED_401);
  });

  // TEST #6.23
  it('Send recovery password code to User_01. Status 400', async () => {
    await request(app)
      .post(`${URL}/auth/password-recovery`)
      .send({ email: "string" })
      .expect(HTTP.BAD_REQUEST_400);
  });

  // TEST #6.24
  it('Send recovery password code to User_01. Status 204', async () => {
    await request(app)
      .post(`${URL}/auth/password-recovery`)
      .send({ email: "eja777one@gmail.com" })
      .expect(HTTP.NO_CONTENT_204);
  });

  // TEST #6.25
  it('Send recovery password code to email, which is unexist in base. Status 204', async () => {
    await request(app)
      .post(`${URL}/auth/password-recovery`)
      .send({ email: "pgs111213@yandex.ru" })
      .expect(HTTP.NO_CONTENT_204);
  });

  // TEST #6.26
  it('Reset password to User_01. Status 400', async () => {
    await request(app)
      .post(`${URL}/auth/new-password`)
      .send({
        newPassword: "string123",
        recoveryCode: "string"
      })
      .expect(HTTP.BAD_REQUEST_400);
  });

  // TEST #6.27
  it('Reset password to User_01. Status 204', async () => {

    const code = await passwordRecoveryRepository
      .getCode(user_01._id);

    // console.log(code?.passwordRecoveryCode)

    await request(app)
      .post(`${URL}/auth/new-password`)
      .send({
        newPassword: "string123",
        recoveryCode: code?.passwordRecoveryCode
      })
      .expect(HTTP.NO_CONTENT_204);
  });

  // TEST #6.28
  it('LOGIN User_01. Status 200', async () => {
    const response = await request(app)
      .post(`${URL}/auth/login`)
      .send({
        loginOrEmail: 'eja777one@gmail.com',
        password: "string123"
      })

    const accessToken = response.body;

    cookie = response.get('Set-Cookie');
    // cookie = response.get('Set-Cookie')[0].split('; ')[0].split('=')[1];

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.OK_200);
    expect(accessToken).toStrictEqual({
      accessToken: expect.any(String),
    });

    token_01 = { ...accessToken };
  });
});