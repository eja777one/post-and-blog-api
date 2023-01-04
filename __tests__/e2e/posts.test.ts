import request from "supertest";
import { app } from "../../src/app";
import { UserViewModel, CommentViewModel, PostViewModel, HTTP } from './../../src/models';

describe('/hometask_06/api/posts', () => {
  let post1: PostViewModel;
  let blog1 = {
    id: "string",
    name: "string",
    description: "string",
    websiteUrl: "string"
  };

  const reqBodyToCreate = {
    title: "string",
    shortDescription: "string",
    content: "string",
    blogId: "string"
  };

  const badReqBody = {
    title: "string",
    shortDescription: "string",
    content: "string",
    blogId: "string"
  };

  const reqBodyToUpdate = {
    title: "string",
    shortDescription: "string",
    content: "string",
    blogId: "string"
  };

  const reqBodyUser = {
    login: 'user1',
    password: "user1pass",
    email: 'user1@mail.ru'
  };

  const reqBodyLogin = {
    loginOrEmail: reqBodyUser.login,
    password: reqBodyUser.password
  };

  let token: {
    accessToken: string
  };

  let user1: UserViewModel;

  let comment1: CommentViewModel;

  const reqBodyComment = {
    content: "stringstringstringst"
  };

  const resBody = {
    errorsMessages: [
      {
        message: `incorrect blogId`,
        field: 'blogId'
      }
    ]
  };

  beforeAll(async () => {
    await request(app).delete('/hometask_06/api/testing/all-data');
  }); // blogs = []; posts = []; users = []; comments = [];

  // TEST #000
  it('CREATE blog FOR TEST. Status 201', async () => {

    const reqBody = {
      name: "string",
      description: "string",
      websiteUrl: "https://www.google.com/"
    };

    const response = await request(app)
      .post('/hometask_06/api/blogs')
      .auth('admin', 'qwerty', { type: 'basic' })
      .send(reqBody);

    const blog = response.body;

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.CREATED_201);
    expect(blog).toStrictEqual({
      id: expect.any(String),
      name: reqBody.name,
      description: reqBody.description,
      websiteUrl: reqBody.websiteUrl,
      createdAt: expect.any(String)
    });

    blog1 = blog;

    reqBodyToCreate.blogId = blog1.id;
    reqBodyToUpdate.blogId = blog1.id;
  }); // blogs = [blog1]; posts = []; users = []; comments = [];

  // TEST #3.1
  it('READ posts. Status 200', async () => {
    await request(app)
      .get('/hometask_06/api/posts')
      .expect(HTTP.OK_200, {
        pagesCount: 0,
        page: 1,
        pageSize: 10,
        totalCount: 0,
        items: []
      });
  }); // blogs = [blog1]; posts = []; users = []; comments = [];

  // TEST #3.2
  it('CREATE post (unauthorized). Status 401', async () => {
    await request(app)
      .post('/hometask_06/api/posts')
      .auth('admin', 'admin', { type: 'basic' })
      .send(reqBodyToCreate)
      .expect(HTTP.UNAUTHORIZED_401);
  }); // blogs = [blog1]; posts = []; users = []; comments = [];

  // TEST #3.3
  it('CREATE post (bad request). Status 400', async () => {
    await request(app)
      .post('/hometask_06/api/posts')
      .auth('admin', 'qwerty', { type: 'basic' })
      .send(badReqBody)
      .expect(HTTP.BAD_REQUEST_400, resBody);
  }); // blogs = [blog1]; posts = []; users = []; comments = [];

  // TEST #3.4
  it('CREATE post. Status 201', async () => {
    const response = await request(app)
      .post('/hometask_06/api/posts')
      .auth('admin', 'qwerty', { type: 'basic' })
      .send(reqBodyToCreate);

    const post = response.body;

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.CREATED_201);
    expect(post).toStrictEqual({
      id: expect.any(String),
      title: reqBodyToCreate.title,
      shortDescription: reqBodyToCreate.shortDescription,
      content: reqBodyToCreate.content,
      blogId: reqBodyToCreate.blogId,
      blogName: blog1.name,
      createdAt: expect.any(String)
    });

    post1 = post;
  }); // blogs = [blog1]; posts = [post1]; users = []; comments = [];

  // TEST #3.5
  it('READ post with id 100. Status 404', async () => {
    await request(app)
      .get(`/hometask_06/api/posts/100`)
      .expect(HTTP.NOT_FOUND_404);
  }); // blogs = [blog1]; posts = [post1]; users = []; comments = [];

  // TEST #3.6
  it('READ post1. Status 200', async () => {
    const response = await request(app)
      .get(`/hometask_06/api/posts/${post1.id}`)

    const post = response.body;

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.OK_200);
    expect(post).toStrictEqual({
      id: post1.id,
      title: post1.title,
      shortDescription: post1.shortDescription,
      content: post1.content,
      blogId: post1.blogId,
      blogName: blog1.name,
      createdAt: post1.createdAt
    });
  }); // blogs = [blog1]; posts = [post1]; users = []; comments = [];

  // TEST #3.7
  it('UPDATE post with id 100. Status 404', async () => {
    await request(app)
      .put(`/hometask_06/api/posts/100`)
      .auth('admin', 'qwerty', { type: 'basic' })
      .send(reqBodyToUpdate)
      .expect(HTTP.NOT_FOUND_404);
  }); // blogs = [blog1]; posts = [post1]; users = []; comments = [];

  // TEST #3.8
  it('UPDATE post1 (unauthorized). Status 401', async () => {
    await request(app)
      .put(`/hometask_06/api/posts/${post1.id}`)
      .auth('admin', 'admin', { type: 'basic' })
      .send(reqBodyToUpdate)
      .expect(HTTP.UNAUTHORIZED_401);
  }); // blogs = [blog1]; posts = [post1]; users = []; comments = [];

  // TEST #3.9
  it('UPDATE post1 (bad request). Status 400', async () => {
    await request(app)
      .put(`/hometask_06/api/posts/${post1.id}`)
      .auth('admin', 'qwerty', { type: 'basic' })
      .send(badReqBody)
      .expect(HTTP.BAD_REQUEST_400, resBody);
  }); // blogs = [blog1]; posts = [post1]; users = []; comments = [];

  // TEST #3.10
  it('UPDATE post1. Status 204', async () => {
    await request(app)
      .put(`/hometask_06/api/posts/${post1.id}`)
      .auth('admin', 'qwerty', { type: 'basic' })
      .send(reqBodyToUpdate)
      .expect(HTTP.NO_CONTENT_204);
  }); // blogs = [blog1]; posts = [post1]; users = []; comments = [];

  // TEST #3.11
  it('READ post1. Status 200', async () => {
    const response = await request(app)
      .get(`/hometask_06/api/posts/${post1.id}`)

    const post = response.body;

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.OK_200);
    expect(post).toStrictEqual({
      id: post1.id,
      blogName: blog1.name,
      createdAt: expect.any(String),
      ...reqBodyToUpdate
    });
  }); // blogs = [blog1]; posts = [post1]; users = []; comments = [];

  // TEST #3.12
  it('GET comments of post with id 100. Status 404', async () => {
    await request(app)
      .get(`/hometask_06/api/posts/100/comments`)
      .expect(HTTP.NOT_FOUND_404);
  }); // blogs = [blog1]; posts = [post1]; users = []; comments = [];

  // TEST #3.13
  it('GET comments of post1. Status 200', async () => {
    await request(app)
      .get(`/hometask_06/api/posts/${post1.id}/comments`)
      .expect(HTTP.OK_200, {
        pagesCount: 0,
        page: 1,
        pageSize: 10,
        totalCount: 0,
        items: []
      });
  }); // blogs = [blog1]; posts = [post1]; users = []; comments = [];

  // TEST #000
  it('Create user1 to creaete comment. Status 201', async () => {
    const response = await request(app)
      .post(`/hometask_06/api/users`)
      .auth('admin', 'qwerty', { type: 'basic' })
      .send(reqBodyUser)

    const user = response.body;

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.CREATED_201);
    expect(user).toStrictEqual({
      id: expect.any(String),
      login: reqBodyUser.login,
      email: reqBodyUser.email,
      createdAt: expect.any(String)
    });

    user1 = { ...user };
  }); // blogs = [blog1]; posts = [post1]; users = [user1]; comments = [];

  // TEST #000
  it('Login user1. Status 200', async () => {
    const response = await request(app)
      .post(`/hometask_06/api/auth/login`)
      .send(reqBodyLogin)

    const accessToken = response.body;

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.OK_200);
    expect(accessToken).toStrictEqual({
      accessToken: expect.any(String),
    });

    token = { ...accessToken };
  }); // blogs = [blog1]; posts = [post1]; users = [user1]; comments = [];

  // TEST #3.16
  it('Create comment for post with id 100. Status 404', async () => {
    await request(app)
      .post(`/hometask_06/api/posts/100/comments`)
      .set('Authorization', `Bearer ${token.accessToken}`)
      .send(reqBodyComment)
      .expect(HTTP.NOT_FOUND_404)
  }); // blogs = [blog1]; posts = [post1]; users = [user1]; comments = [];

  // TEST #3.17
  it('Create comment for post1. Status 401', async () => {
    await request(app)
      .post(`/hometask_06/api/posts/${post1.id}/comments`)
      .set('Authorization', 'token.accessToken')
      .send(reqBodyComment)
      .expect(HTTP.UNAUTHORIZED_401)
  }); // blogs = [blog1]; posts = [post1]; users = [user1]; comments = [];

  // TEST #3.18
  it('Create comment for post1. Status 400', async () => {
    await request(app)
      .post(`/hometask_06/api/posts/${post1.id}/comments`)
      .set('Authorization', `Bearer ${token.accessToken}`)
      .send({ content: 'content' })
      .expect(HTTP.BAD_REQUEST_400)
  }); // blogs = [blog1]; posts = [post1]; users = [user1]; comments = [];

  // TEST #3.19
  it('Create comment for post1. Status 201', async () => {
    const response = await request(app)
      .post(`/hometask_06/api/posts/${post1.id}/comments`)
      .set('Authorization', `Bearer ${token.accessToken}`)
      .send(reqBodyComment)

    console.log(token.accessToken)
    const comment = response.body;

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.CREATED_201);
    expect(comment).toStrictEqual({
      id: expect.any(String),
      content: reqBodyComment.content,
      userId: user1.id,
      userLogin: user1.login,
      createdAt: expect.any(String)
    });

    comment1 = { ...comment };
  }); // blogs = [blog1]; posts = [post1]; users = [user1]; comments = [comment1];

  // TEST #3.20
  it('GET comments of post1. Status 200', async () => {
    await request(app)
      .get(`/hometask_06/api/posts/${post1.id}/comments`)
      .expect(HTTP.OK_200, {
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 1,
        items: [comment1]
      });
  }); // blogs = [blog1]; posts = [post1]; users = [user1]; comments = [comment1];

  // TEST #3.21
  it('Delete post with id 100. Status 404', async () => {
    await request(app)
      .delete(`/hometask_06/api/posts/100`)
      .auth('admin', 'qwerty', { type: 'basic' })
      .expect(HTTP.NOT_FOUND_404);
  }); // blogs = [blog1]; posts = [post1]; users = [user1]; comments = [comment1];

  // TEST #3.22
  it('Delete post1 (unauthorized). Status 401', async () => {
    await request(app)
      .delete(`/hometask_06/api/posts/${post1.id}`)
      .auth('admin', 'admin', { type: 'basic' })
      .expect(HTTP.UNAUTHORIZED_401);
  }); // blogs = [blog1]; posts = [post1]; users = [user1]; comments = [comment1];

  // TEST #3.23
  it('Delete post1. Status 204', async () => {
    await request(app)
      .delete(`/hometask_06/api/posts/${post1.id}`)
      .auth('admin', 'qwerty', { type: 'basic' })
      .expect(HTTP.NO_CONTENT_204);
  }); // blogs = [blog1]; posts = []; users = [user1]; comments = [comment1];

  // TEST #3.24
  it('READ posts. Status 200', async () => {
    await request(app)
      .get('/hometask_06/api/posts')
      .expect(HTTP.OK_200, {
        pagesCount: 0,
        page: 1,
        pageSize: 10,
        totalCount: 0,
        items: []
      });
  }); // blogs = [blog1]; posts = []; users = [user1]; comments = [comment1];
});