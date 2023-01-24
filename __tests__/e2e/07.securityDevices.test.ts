import request from "supertest";
import { app } from "../../src/app";
import { HTTP } from "../../src/models";
import { usersQueryRepository } from "../../src/repositories/05.usersQueryRepository";
import { loginInput1, token1, userInput1, URL, token2, userInput2, loginInput2 } from "./00.dataForTests";
import { ObjectID } from 'bson';

let user_01: any;
let user_02: any;
let token_01 = { ...token1 };
let token_02 = { ...token2 };
let cookieUser_01: string[];
let cookieUser_02: string[];
let deviceIdUser_01: string;
let deviceIdUser_02: string;

describe(`${URL}/auth`, () => {
  beforeAll(async () => {
    await request(app).delete(`${URL}/testing/all-data`);
  });

  // TEST #7.1
  it('Create User_01. Status 204', async () => {
    const response = await request(app)
      .post(`${URL}/auth/registration`)
      .send(userInput1);

    const user = await usersQueryRepository
      .getDbUser(userInput1.email);

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

  // TEST #7.2
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
      sentEmailsCount: expect.any(Number)
    });

    user_01 = { ...user };
  });

  // TEST #7.3
  it('LOGIN User_01. Status 200', async () => {
    const response = await request(app)
      .post(`${URL}/auth/login`)
      .send(loginInput1)

    const accessToken = response.body;

    cookieUser_01 = response.get('Set-Cookie');

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.OK_200);
    expect(accessToken).toStrictEqual({
      accessToken: expect.any(String),
    });

    token_01 = { ...accessToken };
  });

  // TEST #7.4
  it('Get sessions of User_01. Status 401', async () => {
    await request(app)
      .get(`${URL}/security/devices`)
      .set('Cookie', '123')
      .expect(HTTP.UNAUTHORIZED_401);
  });

  // TEST #7.5
  it('Get sessions of User_01. Status 200', async () => {
    const response = await request(app)
      .get(`${URL}/security/devices`)
      .set('Cookie', cookieUser_01);

    const sessions = response.body;

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.OK_200);
    expect(sessions).toStrictEqual([
      {
        ip: expect.any(String),
        title: expect.any(String),
        lastActiveDate: expect.any(String),
        deviceId: expect.any(String),
      }
    ]);
  });

  // TEST #7.6
  it('Delete sessions of User_01. Status 401', async () => {
    const response = await request(app)
      .get(`${URL}/security/devices`)
      .set('Cookie', '123')
      .expect(HTTP.UNAUTHORIZED_401);
  });

  // TEST #7.7
  it('Delete sessions of User_01. Status 204', async () => {
    const response = await request(app)
      .delete(`${URL}/security/devices`)
      .set('Cookie', cookieUser_01)
      .expect(HTTP.NO_CONTENT_204);
  });

  // TEST #7.8
  it('Refresh token to User_01. Status 200', async () => {
    await request(app)
      .post(`${URL}/auth/refresh-token`)
      .set('Cookie', cookieUser_01)
      .expect(HTTP.OK_200);
  });

  // TEST #7.9
  it('Create User_02. Status 204', async () => {
    const response = await request(app)
      .post(`${URL}/auth/registration`)
      .send(userInput2);

    const user = await usersQueryRepository
      .getDbUser(userInput2.email);

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.NO_CONTENT_204);
    expect(user).toStrictEqual({
      _id: expect.any(ObjectID),
      login: userInput2.login,
      email: userInput2.email,
      createdAt: expect.any(String),
      confirmationCode: expect.any(String),
      expirationDate: expect.any(Date),
      isConfirmed: false,
      sentEmailsCount: expect.any(Number)
    });

    user_02 = { ...user };
  });

  // TEST #7.10
  it('Create activation to User_02. Status 204', async () => {
    const response = await request(app)
      .post(`${URL}/auth/registration-confirmation`)
      .send({ code: user_02.confirmationCode })

    const user = await usersQueryRepository.getDbUser(userInput2.email);

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.NO_CONTENT_204);
    expect(user).toStrictEqual({
      _id: expect.any(ObjectID),
      login: userInput2.login,
      email: userInput2.email,
      createdAt: expect.any(String),
      confirmationCode: expect.any(String),
      expirationDate: expect.any(Date),
      isConfirmed: true,
      sentEmailsCount: expect.any(Number)
    });

    user_02 = { ...user };
  });

  // TEST #7.11
  it('LOGIN User_02. Status 200', async () => {
    const response = await request(app)
      .post(`${URL}/auth/login`)
      .send(loginInput2)

    const accessToken = response.body;

    cookieUser_02 = response.get('Set-Cookie');

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.OK_200);
    expect(accessToken).toStrictEqual({
      accessToken: expect.any(String),
    });

    token_02 = { ...accessToken };
  });

  // TEST #7.12
  it('LOGIN User_01. Status 200', async () => {
    const response = await request(app)
      .post(`${URL}/auth/login`)
      .send(loginInput1)

    const accessToken = response.body;

    cookieUser_01 = response.get('Set-Cookie');

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.OK_200);
    expect(accessToken).toStrictEqual({
      accessToken: expect.any(String),
    });

    token_01 = { ...accessToken };
  });

  // TEST #7.13
  it('Get sessions of User_01. Status 200', async () => {
    const response = await request(app)
      .get(`${URL}/security/devices`)
      .set('Cookie', cookieUser_01);

    const sessions = response.body;

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.OK_200);
    expect(sessions).toStrictEqual([
      {
        ip: expect.any(String),
        title: expect.any(String),
        lastActiveDate: expect.any(String),
        deviceId: expect.any(String),
      }
    ]);

    deviceIdUser_01 = sessions[0].deviceId;
  });

  // TEST #7.14
  it('Delete sessions of User_01. Status 404', async () => {
    const response = await request(app)
      .delete(`${URL}/security/devices/123`)
      .set('Cookie', cookieUser_01)
      .expect(HTTP.NOT_FOUND_404);
  });

  // TEST #7.15
  it('Delete sessions of User_01. Status 403', async () => {
    const response = await request(app)
      .delete(`${URL}/security/devices/${deviceIdUser_01}`)
      .set('Cookie', cookieUser_02)
      .expect(HTTP.FORBIDDEN_403);
  });

  // TEST #7.16
  it('Delete sessions of User_01. Status 401', async () => {
    const response = await request(app)
      .delete(`${URL}/security/devices/${deviceIdUser_01}`)
      .set('Cookie', '123')
      .expect(HTTP.UNAUTHORIZED_401);
  });

  // TEST #7.17
  it('Delete sessions of User_01. Status 204', async () => {
    const response = await request(app)
      .delete(`${URL}/security/devices/${deviceIdUser_01}`)
      .set('Cookie', cookieUser_01)
      .expect(HTTP.NO_CONTENT_204);
  });

  // TEST #7.18
  it('Refresh token to User_01. Status 401', async () => {
    await request(app)
      .post(`${URL}/auth/refresh-token`)
      .set('Cookie', cookieUser_01)
      .expect(HTTP.UNAUTHORIZED_401);
  });
});