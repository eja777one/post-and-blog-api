import { BlogViewModel, CommentViewModel, PostViewModel, UserViewModel } from './../../src/models';
import request from "supertest";
import { app } from "../../src/app";
import { HTTP } from "../../src/models";

describe('/hometask_06/api/comments', () => {
  let blog1: BlogViewModel;
  let post1: PostViewModel;
  let user1: UserViewModel;
  let token1: { accessToken: string };
  let user2: UserViewModel;
  let token2: { accessToken: string };
  let comment1: CommentViewModel;

  const reqBodyToCreatePost = {
    title: "string",
    shortDescription: "string",
    content: "string",
    blogId: "string"
  };

  const reqBodyUser1 = {
    login: 'user1',
    password: "user1pass",
    email: 'user1@mail.ru'
  };

  const reqBodyUser2 = {
    login: 'user2',
    password: "user2pass",
    email: 'user2@mail.ru'
  };

  const reqBodyLogin1 = {
    loginOrEmail: reqBodyUser1.login,
    password: reqBodyUser1.password
  };

  const reqBodyLogin2 = {
    loginOrEmail: reqBodyUser2.login,
    password: reqBodyUser2.password
  };

  const reqBodyComment = {
    content: "stringstringstringst"
  };

  const reqBodyCommentUpdate = {
    content: "updateupdateupdateup"
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

    reqBodyToCreatePost.blogId = blog1.id;
  }); // blogs = [blog1]; posts = []; users = []; comments = [];

  // TEST #000
  it('CREATE post. Status 201', async () => {
    const response = await request(app)
      .post('/hometask_06/api/posts')
      .auth('admin', 'qwerty', { type: 'basic' })
      .send(reqBodyToCreatePost);

    const post = response.body;

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.CREATED_201);
    expect(post).toStrictEqual({
      id: expect.any(String),
      title: reqBodyToCreatePost.title,
      shortDescription: reqBodyToCreatePost.shortDescription,
      content: reqBodyToCreatePost.content,
      blogId: reqBodyToCreatePost.blogId,
      blogName: blog1.name,
      createdAt: expect.any(String)
    });

    post1 = post;
  }); // blogs = [blog1]; posts = [post1]; users = []; comments = [];

  // TEST #000
  it('Create user1 to creaete comment. Status 201', async () => {
    const response = await request(app)
      .post(`/hometask_06/api/users`)
      .auth('admin', 'qwerty', { type: 'basic' })
      .send(reqBodyUser1)

    const user = response.body;

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.CREATED_201);
    expect(user).toStrictEqual({
      id: expect.any(String),
      login: reqBodyUser1.login,
      email: reqBodyUser1.email,
      createdAt: expect.any(String)
    });

    user1 = { ...user };
  }); // blogs = [blog1]; posts = [post1]; users = [user1]; comments = [];

  // TEST #000
  it('Create user2 to creaete comment. Status 201', async () => {
    const response = await request(app)
      .post(`/hometask_06/api/users`)
      .auth('admin', 'qwerty', { type: 'basic' })
      .send(reqBodyUser2)

    const user = response.body;

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.CREATED_201);
    expect(user).toStrictEqual({
      id: expect.any(String),
      login: reqBodyUser2.login,
      email: reqBodyUser2.email,
      createdAt: expect.any(String)
    });

    user2 = { ...user };
  }); // blogs = [blog1]; posts = [post1]; users = [user1]; comments = [];

  // TEST #000
  it('Login user1. Status 200', async () => {
    const response = await request(app)
      .post(`/hometask_06/api/auth/login`)
      .send(reqBodyLogin1)

    const accessToken = response.body;

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.OK_200);
    expect(accessToken).toStrictEqual({
      accessToken: expect.any(String),
    });

    token1 = { ...accessToken };
  }); // blogs = [blog1]; posts = [post1]; users = [user1]; comments = [];

  // TEST #000
  it('Login user2. Status 200', async () => {
    const response = await request(app)
      .post(`/hometask_06/api/auth/login`)
      .send(reqBodyLogin2)

    const accessToken = response.body;

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.OK_200);
    expect(accessToken).toStrictEqual({
      accessToken: expect.any(String),
    });

    token2 = { ...accessToken };
  }); // blogs = [blog1]; posts = [post1]; users = [user1]; comments = [];

  // TEST #000
  it('Create comment for post1. Status 201', async () => {
    const response = await request(app)
      .post(`/hometask_06/api/posts/${post1.id}/comments`)
      .set('Authorization', `Bearer ${token1.accessToken}`)
      .send(reqBodyComment)

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

  // TEST #5.1
  it('Update comment with id 100. Status 404', async () => {
    await request(app)
      .put(`/hometask_06/api/comments/100`)
      .set('Authorization', `Bearer ${token1.accessToken}`)
      .send(reqBodyCommentUpdate)
      .expect(HTTP.NOT_FOUND_404)
  }); // blogs = [blog1]; posts = [post1]; users = [user1]; comments = [comment1];

  // TEST #5.2
  it('Update comment1. Status 403', async () => {
    await request(app)
      .put(`/hometask_06/api/comments/${comment1.id}`)
      .set('Authorization', `Bearer ${token2.accessToken}`)
      .send(reqBodyCommentUpdate)
      .expect(HTTP.FORBIDDEN_403)
  }); // blogs = [blog1]; posts = [post1]; users = [user1]; comments = [comment1];

  // TEST #5.3
  it('Update comment1. Status 401', async () => {
    await request(app)
      .put(`/hometask_06/api/comments/${comment1.id}`)
      .set('Authorization', `Bearer token1.accessToken`)
      .send(reqBodyCommentUpdate)
      .expect(HTTP.UNAUTHORIZED_401)
  }); // blogs = [blog1]; posts = [post1]; users = [user1]; comments = [comment1];

  // TEST #5.4
  it('Update comment1. Status 400', async () => {
    await request(app)
      .put(`/hometask_06/api/comments/${comment1.id}`)
      .set('Authorization', `Bearer ${token1.accessToken}`)
      .send({ content: 'bad content' })
      .expect(HTTP.BAD_REQUEST_400)
  }); // blogs = [blog1]; posts = [post1]; users = [user1]; comments = [comment1];

  // TEST #5.5
  it('Update comment1. Status 204', async () => {
    await request(app)
      .put(`/hometask_06/api/comments/${comment1.id}`)
      .set('Authorization', `Bearer ${token1.accessToken}`)
      .send(reqBodyCommentUpdate)
      .expect(HTTP.NO_CONTENT_204)

    comment1.content = reqBodyCommentUpdate.content;
  }); // blogs = [blog1]; posts = [post1]; users = [user1]; comments = [comment1];

  // TEST #5.6
  it('Get comment1. Status 200', async () => {
    const response = await request(app)
      .get(`/hometask_06/api/comments/${comment1.id}`)

    const comment = response.body;

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.OK_200);
    expect(comment).toStrictEqual(comment1);
  }); // blogs = [blog1]; posts = [post1]; users = [user1]; comments = [comment1];

  // TEST #5.7
  it('Get comment with id 100. Status 200', async () => {
    const response = await request(app)
      .get(`/hometask_06/api/comments/100`)
      .expect(HTTP.NOT_FOUND_404)
  }); // blogs = [blog1]; posts = [post1]; users = [user1]; comments = [comment1];

  // TEST #5.8
  it('Delete comment with id 100. Status 404', async () => {
    await request(app)
      .delete(`/hometask_06/api/comments/100`)
      .set('Authorization', `Bearer ${token1.accessToken}`)
      .expect(HTTP.NOT_FOUND_404)
  }); // blogs = [blog1]; posts = [post1]; users = [user1]; comments = [comment1];

  // TEST #5.9
  it('Delete comment1. Status 403', async () => {
    await request(app)
      .delete(`/hometask_06/api/comments/${comment1.id}`)
      .set('Authorization', `Bearer ${token2.accessToken}`)
      .expect(HTTP.FORBIDDEN_403)
  }); // blogs = [blog1]; posts = [post1]; users = [user1]; comments = [comment1];

  // TEST #5.10
  it('Delete comment1. Status 401', async () => {
    await request(app)
      .delete(`/hometask_06/api/comments/${comment1.id}`)
      .set('Authorization', `Bearer token2.accessToken`)
      .expect(HTTP.UNAUTHORIZED_401)
  }); // blogs = [blog1]; posts = [post1]; users = [user1]; comments = [comment1];

  // TEST #5.11
  it('Delete comment1. Status 204', async () => {
    await request(app)
      .delete(`/hometask_06/api/comments/${comment1.id}`)
      .set('Authorization', `Bearer ${token1.accessToken}`)
      .expect(HTTP.NO_CONTENT_204)
  }); // blogs = [blog1]; posts = [post1]; users = [user1]; comments = [];

  // TEST #5.12
  it('Get comment1. Status 404', async () => {
    await request(app)
      .get(`/hometask_06/api/comments/${comment1.id}`)
      .expect(HTTP.NOT_FOUND_404)
  }); // blogs = [blog1]; posts = [post1]; users = [user1]; comments = [comment1];
});