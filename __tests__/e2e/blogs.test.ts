import request from "supertest";
import { app } from "../../src/app";
import { BlogViewModel, PostViewModel, HTTP } from "../../src/models";

describe('/hometask_06/api/blogs', () => {
  let blog1: BlogViewModel;
  let post1: PostViewModel;

  const reqBodyToCreate = {
    name: "string",
    description: "string",
    websiteUrl: "https://www.google.com/"
  };

  const reqBodyToUpdate = {
    name: "new",
    description: "new",
    websiteUrl: "https://www.google.com/"
  };

  const badReqBody = {
    name: 3,
    description: "string",
    websiteUrl: "https://www.google.com/"
  };

  const resBody = {
    errorsMessages: [
      {
        message: `incorrect name`,
        field: 'name'
      }
    ]
  };

  const reqBodyToCreatePost = {
    title: "string",
    shortDescription: "string",
    content: "string",
  };

  const reqBadBodyToCreatePost = {
    title: "string",
    shortDescription: "string",
  }

  beforeAll(async () => {
    await request(app).delete('/hometask_06/api/testing/all-data');
  }); // blogs = [];

  // TEST #2.1
  it('READ blogs. Status 200', async () => {
    await request(app)
      .get('/hometask_06/api/blogs')
      .expect(HTTP.OK_200, {
        pagesCount: 0,
        page: 1,
        pageSize: 10,
        totalCount: 0,
        items: []
      });
  }); // blogs = []; post = [];

  // TEST #2.2
  it('CREATE blog (unauthorized). Status 401', async () => {
    await request(app)
      .post('/hometask_06/api/blogs')
      .auth('admin', 'admin', { type: 'basic' })
      .send(reqBodyToCreate)
      .expect(HTTP.UNAUTHORIZED_401);
  }); // blogs = []; post = [];

  // TEST #2.3
  it('CREATE blog (bad request). Status 400', async () => {
    await request(app)
      .post('/hometask_06/api/blogs')
      .auth('admin', 'qwerty', { type: 'basic' })
      .send(badReqBody)
      .expect(HTTP.BAD_REQUEST_400, resBody);
  }); // blogs = []; post = [];

  // TEST #2.4
  it('CREATE blog. Status 201', async () => {
    const response = await request(app)
      .post('/hometask_06/api/blogs')
      .auth('admin', 'qwerty', { type: 'basic' })
      .send(reqBodyToCreate);

    const blog = response.body;

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.CREATED_201);
    expect(blog).toStrictEqual({
      id: expect.any(String),
      name: reqBodyToCreate.name,
      description: reqBodyToCreate.description,
      websiteUrl: reqBodyToCreate.websiteUrl,
      createdAt: expect.any(String)
    });

    blog1 = blog;
  }); // blogs = [blog1]; post = [];

  // TEST #2.5
  it('READ blog with id 100. Status 404', async () => {
    await request(app)
      .get(`/hometask_06/api/blogs/100`)
      .expect(HTTP.NOT_FOUND_404);
  }); // blogs = [blog1]; post = [];

  // TEST #2.6 
  it('READ blog1. Status 200', async () => {
    const response = await request(app)
      .get(`/hometask_06/api/blogs/${blog1.id}`)

    const blog = response.body;

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.OK_200);
    expect(blog).toStrictEqual({
      id: blog1.id,
      name: blog1.name,
      description: blog1.description,
      websiteUrl: blog1.websiteUrl,
      createdAt: blog1.createdAt
    });
  }); // blogs = [blog1]; post = [];

  // TEST #2.7
  it('UPDATE blog with id 100. Status 404', async () => {
    await request(app)
      .put(`/hometask_06/api/blogs/100`)
      .auth('admin', 'qwerty', { type: 'basic' })
      .send(reqBodyToUpdate)
      .expect(HTTP.NOT_FOUND_404);
  }); // blogs = [blog1]; post = [];

  // TEST #2.8
  it('UPDATE blog1 (unauthorized). Status 401', async () => {
    await request(app)
      .put(`/hometask_06/api/blogs/${blog1.id}`)
      .auth('admin', 'admin', { type: 'basic' })
      .send(reqBodyToUpdate)
      .expect(HTTP.UNAUTHORIZED_401);
  }); // blogs = [blog1]; post = [];

  // TEST #2.9
  it('UPDATE blog1 (bad request). Status 400', async () => {
    await request(app)
      .put(`/hometask_06/api/blogs/${blog1.id}`)
      .auth('admin', 'qwerty', { type: 'basic' })
      .send(badReqBody)
      .expect(HTTP.BAD_REQUEST_400, resBody);
  }); // blogs = [blog1]; post = [];

  // TEST #2.10
  it('UPDATE blog1. Status 204', async () => {
    await request(app)
      .put(`/hometask_06/api/blogs/${blog1.id}`)
      .auth('admin', 'qwerty', { type: 'basic' })
      .send(reqBodyToUpdate)
      .expect(HTTP.NO_CONTENT_204);

    blog1.name = reqBodyToUpdate.name
    blog1.description = reqBodyToUpdate.description
  }); // blogs = [blog1]; post = [];

  // TEST #2.11
  it('READ blog1. Status 200', async () => {
    const response = await request(app)
      .get(`/hometask_06/api/blogs/${blog1.id}`)

    const blog = response.body;

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.OK_200);
    expect(blog).toStrictEqual({
      id: blog1.id,
      createdAt: expect.any(String),
      ...reqBodyToUpdate
    });
  }); // blogs = [blog1]; post = [];

  // TEST #2.12
  it('GET posts of blog 100. Status 404', async () => {
    await request(app)
      .get(`/hometask_06/api/blogs/100/posts`)
      .expect(HTTP.NOT_FOUND_404);
  }); // blogs = [blog1]; post = [];

  // TEST #2.13
  it('GET posts of blog1. Status 200', async () => {
    // console.log(blog1.id)
    await request(app)
      .get(`/hometask_06/api/blogs/${blog1.id}/posts`)
      .expect(HTTP.OK_200, {
        pagesCount: 0,
        page: 1,
        pageSize: 10,
        totalCount: 0,
        items: []
      });
  }); // blogs = [blog1]; post = [];

  // TEST #2.14
  it('POST post for blog100. Status 404', async () => {
    await request(app)
      .post(`/hometask_06/api/blogs/100/posts`)
      .auth('admin', 'qwerty', { type: 'basic' })
      .send(reqBodyToCreatePost)
      .expect(HTTP.NOT_FOUND_404);
  }); // blogs = [blog1]; post = [];

  // TEST #2.15
  it('POST post for blog1 (unauthorized). Status 401', async () => {
    await request(app)
      .post(`/hometask_06/api/blogs/${blog1.id}/posts`)
      .auth('admin', 'admin', { type: 'basic' })
      .send(reqBodyToCreatePost)
      .expect(HTTP.UNAUTHORIZED_401);
  }); // blogs = [blog1]; post = [];

  // TEST #2.16
  it('POST post for blog1 (bad request). Status 400', async () => {
    await request(app)
      .post(`/hometask_06/api/blogs/${blog1.id}/posts`)
      .auth('admin', 'qwerty', { type: 'basic' })
      .send(reqBadBodyToCreatePost)
      .expect(HTTP.BAD_REQUEST_400);
  }); // blogs = [blog1]; post = [];

  // TEST #2.17
  it('POST post for blog1. Status 201', async () => {
    const response = await request(app)
      .post(`/hometask_06/api/blogs/${blog1.id}/posts`)
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
      blogId: blog1.id,
      blogName: blog1.name,
      createdAt: expect.any(String)
    });

    post1 = post;
  }); // blogs = [blog1]; post = [post1];

  // TEST #2.18
  it('GET posts of blog1. Status 200', async () => {
    await request(app)
      .get(`/hometask_06/api/blogs/${blog1.id}/posts`)
      .expect(HTTP.OK_200, {
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 1,
        items: [post1]
      });
  }); // blogs = [blog1]; post = [post1];

  // TEST #2.19
  it('Delete blog with id 100. Status 404', async () => {
    await request(app)
      .delete(`/hometask_06/api/blogs/100`)
      .auth('admin', 'qwerty', { type: 'basic' })
      .expect(HTTP.NOT_FOUND_404);
  }); // blogs = [blog1]; post = [post1];

  // TEST #2.20
  it('Delete blog1 (unauthorized). Status 401', async () => {
    await request(app)
      .delete(`/hometask_06/api/blogs/${blog1.id}`)
      .auth('admin', 'admin', { type: 'basic' })
      .expect(HTTP.UNAUTHORIZED_401);
  }); // blogs = [blog1]; post = [post1];

  // TEST #2.21
  it('Delete blog1. Status 204', async () => {
    await request(app)
      .delete(`/hometask_06/api/blogs/${blog1.id}`)
      .auth('admin', 'qwerty', { type: 'basic' })
      .expect(HTTP.NO_CONTENT_204);
  }); // blogs = []; post = [];

  // TEST #2.22
  it('READ blogs. Status 200', async () => {
    await request(app)
      .get('/hometask_06/api/blogs')
      .expect(HTTP.OK_200, {
        pagesCount: 0,
        page: 1,
        pageSize: 10,
        totalCount: 0,
        items: []
      });
  }); // blogs = []; post = [];
});