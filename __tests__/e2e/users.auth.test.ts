import { UserViewModel } from '../../src/models';
import request from "supertest";
import { app } from "../../src/app";
import { HTTP } from "../../src/models";

describe('/hometask_05/api/users', () => {
  let user1: UserViewModel;
  let user2: UserViewModel;

  const user1Input = {
    login: 'userr1',
    password: 'password1',
    email: 'user1@mail.com'
  }

  const user2Input = {
    login: 'userr2',
    password: 'password2',
    email: 'user2@mail.com'
  }

  const user1BadInput = {
    login: 'u',
    password: 'password1',
    email: 'user1@mail.com'
  }

  beforeAll(async () => {
    await request(app).delete('/hometask_05/api/testing/all-data');
  }); // blogs = [];

  // TEST #4.1
  it('GET Users. Status 401', async () => {
    await request(app)
      .get('/hometask_05/api/users')
      .auth('admin', 'admin', { type: 'basic' })
      .expect(HTTP.UNAUTHORIZED_401);
  });

  // TEST #4.2
  it('GET Users. Status 200', async () => {
    await request(app)
      .get('/hometask_05/api/users')
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
  it('Create User (unauthorized). Status 401', async () => {
    await request(app)
      .post('/hometask_05/api/users')
      .auth('admin', 'admin', { type: 'basic' })
      .send(user1Input)
      .expect(HTTP.UNAUTHORIZED_401);
  });

  // TEST #4.4
  it('Create User (bad request). Status 400', async () => {
    await request(app)
      .post('/hometask_05/api/users')
      .auth('admin', 'qwerty', { type: 'basic' })
      .send(user1BadInput)
      .expect(HTTP.BAD_REQUEST_400);
  });

  // TEST #4.5
  it('Create User1. Status 201', async () => {
    const response = await request(app)
      .post('/hometask_05/api/users')
      .auth('admin', 'qwerty', { type: 'basic' })
      .send(user1Input)

    const user = response.body;

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.CREATED_201);
    expect(user).toStrictEqual({
      id: expect.any(String),
      login: user1Input.login,
      email: user1Input.email,
      createdAt: expect.any(String)
    });

    user1 = user;
  });

  // TEST #4.6
  it('Create User2. Status 201', async () => {
    const response = await request(app)
      .post('/hometask_05/api/users')
      .auth('admin', 'qwerty', { type: 'basic' })
      .send(user2Input)

    const user = response.body;

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.CREATED_201);
    expect(user).toStrictEqual({
      id: expect.any(String),
      login: user2Input.login,
      email: user2Input.email,
      createdAt: expect.any(String)
    });

    user2 = user;
  });

  // TEST #4.7
  it('GET Users. Status 200', async () => {
    await request(app)
      .get('/hometask_05/api/users')
      .auth('admin', 'qwerty', { type: 'basic' })
      .expect(HTTP.OK_200, {
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 2,
        items: [user2, user1]
      });
  });

  // TEST #4.8
  it('DELETE User10. Status 404', async () => {
    await request(app)
      .delete('/hometask_05/api/users/10')
      .auth('admin', 'qwerty', { type: 'basic' })
      .expect(HTTP.NOT_FOUND_404);
  });

  // TEST #4.9
  it('DELETE User2. Status 401', async () => {
    await request(app)
      .delete(`/hometask_05/api/users/${user2.id}`)
      .auth('admin', 'admin', { type: 'basic' })
      .expect(HTTP.UNAUTHORIZED_401);
  });

  // TEST #4.10
  it('DELETE User2. Status 204', async () => {
    await request(app)
      .delete(`/hometask_05/api/users/${user2.id}`)
      .auth('admin', 'qwerty', { type: 'basic' })
      .expect(HTTP.NO_CONTENT_204);
  });

  // TEST #4.11
  it('LOGIN User1. Status 204', async () => {
    const loginBody = {
      loginOrEmail: user1Input.login,
      password: user1Input.password
    };
    await request(app)
      .post(`/hometask_05/api/auth/login`)
      .send(loginBody)
      .expect(HTTP.NO_CONTENT_204);
  });

  // TEST #4.12
  it('LOGIN User1. Status 400', async () => {
    const loginBody = {
      loginOrEmail: 424,
      password: user1Input.password
    };
    await request(app)
      .post(`/hometask_05/api/auth/login`)
      .send(loginBody)
      .expect(HTTP.BAD_REQUEST_400);
  });

  // TEST #4.13
  it('LOGIN User1. Status 401', async () => {
    const loginBody = {
      loginOrEmail: 'LOGIN',
      password: user1Input.password
    };
    await request(app)
      .post(`/hometask_05/api/auth/login`)
      .send(loginBody)
      .expect(HTTP.UNAUTHORIZED_401);
  });

  // TEST #4.14
  it('DELETE User1. Status 204', async () => {
    await request(app)
      .delete(`/hometask_05/api/users/${user1.id}`)
      .auth('admin', 'qwerty', { type: 'basic' })
      .expect(HTTP.NO_CONTENT_204);
  });

  // TEST #4.15
  it('GET Users. Status 200', async () => {
    await request(app)
      .get('/hometask_05/api/users')
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