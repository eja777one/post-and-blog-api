import request from "supertest";
import { app } from "../../src/app";
import { PostViewModel, HTTP } from "../../src/models";

describe('/hometask_05/api/posts', () => {

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

  const resBody = {
    errorsMessages: [
      {
        message: `incorrect blogId`,
        field: 'blogId'
      }
    ]
  };

  beforeAll(async () => {
    await request(app).delete('/hometask_05/api/testing/all-data');
  }); // posts = []; blogs = [];

  // TEST #000
  it('CREATE blog FOR TEST. Status 201', async () => {

    const reqBody = {
      name: "string",
      description: "string",
      websiteUrl: "https://www.google.com/"
    };

    const response = await request(app)
      .post('/hometask_05/api/blogs')
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
  }); // posts = []; blogs = [blog1];

  // TEST #3.1
  it('READ posts. Status 200', async () => {
    await request(app)
      .get('/hometask_05/api/posts')
      .expect(HTTP.OK_200, {
        pagesCount: 0,
        page: 1,
        pageSize: 10,
        totalCount: 0,
        items: []
      });
  }); // posts = []; blogs = [blog1];

  // TEST #3.2
  it('CREATE post (unauthorized). Status 401', async () => {
    await request(app)
      .post('/hometask_05/api/posts')
      .auth('admin', 'admin', { type: 'basic' })
      .send(reqBodyToCreate)
      .expect(HTTP.UNAUTHORIZED_401);
  }); // posts = []; blogs = [blog1];

  // TEST #3.3
  it('CREATE post (bad request). Status 400', async () => {
    await request(app)
      .post('/hometask_05/api/posts')
      .auth('admin', 'qwerty', { type: 'basic' })
      .send(badReqBody)
      .expect(HTTP.BAD_REQUEST_400, resBody);
  }); // posts = []; blogs = [blog1];

  // TEST #3.4
  it('CREATE post. Status 201', async () => {
    const response = await request(app)
      .post('/hometask_05/api/posts')
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
  }); // posts = [post1]; blogs = [blog1];

  // TEST #3.5
  it('READ post with id 100. Status 404', async () => {
    await request(app)
      .get(`/hometask_05/api/posts/100`)
      .expect(HTTP.NOT_FOUND_404);
  }); // posts = [post1]; blogs = [blog1];

  // TEST #3.6
  it('READ post1. Status 200', async () => {
    const response = await request(app)
      .get(`/hometask_05/api/posts/${post1.id}`)

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
  }); // posts = [post1]; blogs = [blog1];

  // TEST #3.7
  it('UPDATE post with id 100. Status 404', async () => {
    await request(app)
      .put(`/hometask_05/api/posts/100`)
      .auth('admin', 'qwerty', { type: 'basic' })
      .send(reqBodyToUpdate)
      .expect(HTTP.NOT_FOUND_404);
  }); // posts = [post1]; blogs = [blog1];

  // TEST #3.8
  it('UPDATE post1 (unauthorized). Status 401', async () => {
    await request(app)
      .put(`/hometask_05/api/posts/${post1.id}`)
      .auth('admin', 'admin', { type: 'basic' })
      .send(reqBodyToUpdate)
      .expect(HTTP.UNAUTHORIZED_401);
  }); // posts = [post1]; blogs = [blog1];

  // TEST #3.9
  it('UPDATE post1 (bad request). Status 400', async () => {
    await request(app)
      .put(`/hometask_05/api/posts/${post1.id}`)
      .auth('admin', 'qwerty', { type: 'basic' })
      .send(badReqBody)
      .expect(HTTP.BAD_REQUEST_400, resBody);
  }); // posts = [post1]; blogs = [blog1];

  // TEST #3.10
  it('UPDATE post1. Status 204', async () => {
    await request(app)
      .put(`/hometask_05/api/posts/${post1.id}`)
      .auth('admin', 'qwerty', { type: 'basic' })
      .send(reqBodyToUpdate)
      .expect(HTTP.NO_CONTENT_204);
  }); // posts = [post1]; blogs = [blog1];

  // TEST #3.11
  it('READ post1. Status 200', async () => {
    const response = await request(app)
      .get(`/hometask_05/api/posts/${post1.id}`)

    const post = response.body;

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.OK_200);
    expect(post).toStrictEqual({
      id: post1.id,
      blogName: blog1.name,
      createdAt: expect.any(String),
      ...reqBodyToUpdate
    });
  }); // posts = [post1]; blogs = [blog1];

  // TEST #3.12
  it('Delete post with id 100. Status 404', async () => {
    await request(app)
      .delete(`/hometask_05/api/posts/100`)
      .auth('admin', 'qwerty', { type: 'basic' })
      .expect(HTTP.NOT_FOUND_404);
  }); // posts = [post1]; blogs = [blog1];

  // TEST #3.13
  it('Delete post1 (unauthorized). Status 401', async () => {
    await request(app)
      .delete(`/hometask_05/api/posts/${post1.id}`)
      .auth('admin', 'admin', { type: 'basic' })
      .expect(HTTP.UNAUTHORIZED_401);
  }); // posts = [post1]; blogs = [blog1];

  // TEST #3.14
  it('Delete post1. Status 204', async () => {
    await request(app)
      .delete(`/hometask_05/api/posts/${post1.id}`)
      .auth('admin', 'qwerty', { type: 'basic' })
      .expect(HTTP.NO_CONTENT_204);
  }); // posts = []; blogs = [blog1];

  // TEST #3.15
  it('READ posts. Status 200', async () => {
    await request(app)
      .get('/hometask_05/api/posts')
      .expect(HTTP.OK_200, {
        pagesCount: 0,
        page: 1,
        pageSize: 10,
        totalCount: 0,
        items: []
      });
  }); // posts = []; blogs = [blog1];
});