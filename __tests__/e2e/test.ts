import request from "supertest";
import { app } from "../../src";
import { HTTP } from "../../src/HTTPStatusCodes";
import { BlogViewModel, PostViewModel } from "../../src/models";

describe('/hometask_03/apr/testing/all-data', () => {
  // TEST #1.1
  it('should delete all videos and return empty array', async () => {
    await request(app)
      .delete('/hometask_03/api/testing/all-data')
      .expect(HTTP.NO_CONTENT_204);
  });
});

describe('/hometask_03/api/blogs', () => {
  let blog1: BlogViewModel;

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

  beforeAll(async () => {
    await request(app).delete('/hometask_03/api/testing/all-data');
  }); // blogs = [];

  // TEST #2.1
  it('READ blogs. Should return 200', async () => {
    await request(app)
      .get('/hometask_03/api/blogs')
      .expect(HTTP.OK_200, []);
  }); // blogs = [];

  // TEST #2.2
  it('CREATE blog (unauthorized). Should return 401', async () => {
    await request(app)
      .post('/hometask_03/api/blogs')
      .auth('admin', 'admin', { type: 'basic' })
      .send(reqBodyToCreate)
      .expect(HTTP.UNAUTHORIZED_401);
  }); // blogs = [];

  // TEST #2.3
  it('CREATE blog (bad request). Should return 400', async () => {
    await request(app)
      .post('/hometask_03/api/blogs')
      .auth('admin', 'qwerty', { type: 'basic' })
      .send(badReqBody)
      .expect(HTTP.BAD_REQUEST_400, resBody);
  }); // blogs = [];

  // TEST #2.4
  it('CREATE blog. Should return 201', async () => {
    const response = await request(app)
      .post('/hometask_03/api/blogs')
      .auth('admin', 'qwerty', { type: 'basic' })
      .send(reqBodyToCreate);

    const blog = response.body;

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.CREATED_201);
    expect(blog).toStrictEqual({
      _id: expect.any(String),
      id: expect.any(String),
      name: reqBodyToCreate.name,
      description: reqBodyToCreate.description,
      websiteUrl: reqBodyToCreate.websiteUrl,
      createdAt: expect.any(String)
    });

    blog1 = blog;
    // console.log(blog1)
  }); // blogs = [blog1];

  // TEST #2.5
  it('READ blog with id 100. Should return 404', async () => {
    await request(app)
      .get(`/hometask_03/api/blogs/100`)
      .expect(HTTP.NOT_FOUND_404);
  }); // blogs = [blog1];

  // TEST #2.6 
  it('READ blog1. Should return 200', async () => {
    const response = await request(app)
      .get(`/hometask_03/api/blogs/${blog1.id}`)

    const blog = response.body;

    console.log(blog1.id);
    console.log(blog);

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.OK_200);
    expect(blog).toStrictEqual(blog1);
  }); // blogs = [blog1];

  // TEST #2.7
  it('UPDATE blog with id 100. Should return 404', async () => {
    await request(app)
      .put(`/hometask_03/api/blogs/100`)
      .auth('admin', 'qwerty', { type: 'basic' })
      .send(reqBodyToUpdate)
      .expect(HTTP.NOT_FOUND_404);
  }); // blogs = [blog1];

  // TEST #2.8
  it('UPDATE blog1 (unauthorized). Should return 401', async () => {
    await request(app)
      .put(`/hometask_03/api/blogs/${blog1.id}`)
      .auth('admin', 'admin', { type: 'basic' })
      .send(reqBodyToUpdate)
      .expect(HTTP.UNAUTHORIZED_401);
  }); // blogs = [blog1];

  // TEST #2.9
  it('UPDATE blog1 (bad request). Should return 400', async () => {
    await request(app)
      .put(`/hometask_03/api/blogs/${blog1.id}`)
      .auth('admin', 'qwerty', { type: 'basic' })
      .send(badReqBody)
      .expect(HTTP.BAD_REQUEST_400, resBody);
  }); // blogs = [blog1];

  // TEST #2.10
  it('UPDATE blog1. Should return 204', async () => {
    await request(app)
      .put(`/hometask_03/api/blogs/${blog1.id}`)
      .auth('admin', 'qwerty', { type: 'basic' })
      .send(reqBodyToUpdate)
      .expect(HTTP.NO_CONTENT_204);
  }); // blogs = [blog1];

  // TEST #2.11
  it('READ blog1. Should return 200', async () => {
    const response = await request(app)
      .get(`/hometask_03/api/blogs/${blog1.id}`)

    const blog = response.body;

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.OK_200);
    expect(blog).toStrictEqual({
      _id: expect.any(String),
      id: blog1.id,
      createdAt: expect.any(String),
      ...reqBodyToUpdate
    });
  }); // blogs = [blog1];

  // TEST #2.12
  it('Delete blog with id 100. Should return 404', async () => {
    await request(app)
      .delete(`/hometask_03/api/blogs/100`)
      .auth('admin', 'qwerty', { type: 'basic' })
      .expect(HTTP.NOT_FOUND_404);
  }); // blogs = [blog1];

  // TEST #2.13
  it('Delete blog1 (unauthorized). Should return 401', async () => {
    await request(app)
      .delete(`/hometask_03/api/blogs/${blog1.id}`)
      .auth('admin', 'admin', { type: 'basic' })
      .expect(HTTP.UNAUTHORIZED_401);
  }); // blogs = [blog1];

  // TEST #2.14
  it('Delete blog1. Should return 204', async () => {
    await request(app)
      .delete(`/hometask_03/api/blogs/${blog1.id}`)
      .auth('admin', 'qwerty', { type: 'basic' })
      .expect(HTTP.NO_CONTENT_204);
  }); // blogs = [];

  // TEST #2.15
  it('READ blogs. Should return 200', async () => {
    await request(app)
      .get('/hometask_03/api/blogs')
      .expect(HTTP.OK_200, []);
  }); // blogs = [];
});

describe('/hometask_03/api/posts', () => {

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
    await request(app).delete('/hometask_03/apr/testing/all-data');
  }); // posts = []; blogs = [];

  // TEST #000
  it('CREATE blog FOR TEST. Should return 201', async () => {

    const reqBody = {
      name: "string",
      description: "string",
      websiteUrl: "https://www.google.com/"
    };

    const response = await request(app)
      .post('/hometask_03/api/blogs')
      .auth('admin', 'qwerty', { type: 'basic' })
      .send(reqBody);

    const blog = response.body;

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.CREATED_201);
    expect(blog).toStrictEqual({
      _id: expect.any(String),
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
  it('READ posts. Should return 200', async () => {
    await request(app)
      .get('/hometask_03/api/posts')
      .expect(HTTP.OK_200, []);
  }); // posts = []; blogs = [blog1];

  // TEST #3.2
  it('CREATE post (unauthorized). Should return 401', async () => {
    await request(app)
      .post('/hometask_03/api/posts')
      .auth('admin', 'admin', { type: 'basic' })
      .send(reqBodyToCreate)
      .expect(HTTP.UNAUTHORIZED_401);
  }); // posts = []; blogs = [blog1];

  // TEST #3.3
  it('CREATE post (bad request). Should return 400', async () => {
    await request(app)
      .post('/hometask_03/api/posts')
      .auth('admin', 'qwerty', { type: 'basic' })
      .send(badReqBody)
      .expect(HTTP.BAD_REQUEST_400, resBody);
  }); // posts = []; blogs = [blog1];

  // TEST #3.4
  it('CREATE post. Should return 201', async () => {
    const response = await request(app)
      .post('/hometask_03/api/posts')
      .auth('admin', 'qwerty', { type: 'basic' })
      .send(reqBodyToCreate);

    const post = response.body;

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.CREATED_201);
    expect(post).toStrictEqual({
      _id: expect.any(String),
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
  it('READ post with id 100. Should return 404', async () => {
    await request(app)
      .get(`/hometask_03/api/posts/100`)
      .expect(HTTP.NOT_FOUND_404);
  }); // posts = [post1]; blogs = [blog1];

  // TEST #3.6
  it('READ post1. Should return 200', async () => {
    const response = await request(app)
      .get(`/hometask_03/api/posts/${post1.id}`)

    const post = response.body;

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.OK_200);
    expect(post).toStrictEqual({
      _id: expect.any(String),
      ...post1
    });
  }); // posts = [post1]; blogs = [blog1];

  // TEST #3.7
  it('UPDATE post with id 100. Should return 404', async () => {
    await request(app)
      .put(`/hometask_03/api/posts/100`)
      .auth('admin', 'qwerty', { type: 'basic' })
      .send(reqBodyToUpdate)
      .expect(HTTP.NOT_FOUND_404);
  }); // posts = [post1]; blogs = [blog1];

  // TEST #3.8
  it('UPDATE post1 (unauthorized). Should return 401', async () => {
    await request(app)
      .put(`/hometask_03/api/posts/${post1.id}`)
      .auth('admin', 'admin', { type: 'basic' })
      .send(reqBodyToUpdate)
      .expect(HTTP.UNAUTHORIZED_401);
  }); // posts = [post1]; blogs = [blog1];

  // TEST #3.9
  it('UPDATE post1 (bad request). Should return 400', async () => {
    await request(app)
      .put(`/hometask_03/api/posts/${post1.id}`)
      .auth('admin', 'qwerty', { type: 'basic' })
      .send(badReqBody)
      .expect(HTTP.BAD_REQUEST_400, resBody);
  }); // posts = [post1]; blogs = [blog1];

  // TEST #3.10
  it('UPDATE post1. Should return 204', async () => {
    await request(app)
      .put(`/hometask_03/api/posts/${post1.id}`)
      .auth('admin', 'qwerty', { type: 'basic' })
      .send(reqBodyToUpdate)
      .expect(HTTP.NO_CONTENT_204);
  }); // posts = [post1]; blogs = [blog1];

  // TEST #3.11
  it('READ post1. Should return 200', async () => {
    const response = await request(app)
      .get(`/hometask_03/api/posts/${post1.id}`)

    const post = response.body;

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.OK_200);
    expect(post).toStrictEqual({
      _id: expect.any(String),
      id: post1.id,
      blogName: blog1.name,
      createdAt: expect.any(String),
      ...reqBodyToUpdate
    });
  }); // posts = [post1]; blogs = [blog1];

  // TEST #3.12
  it('Delete post with id 100. Should return 404', async () => {
    await request(app)
      .delete(`/hometask_03/api/posts/100`)
      .auth('admin', 'qwerty', { type: 'basic' })
      .expect(HTTP.NOT_FOUND_404);
  }); // posts = [post1]; blogs = [blog1];

  // TEST #3.13
  it('Delete post1 (unauthorized). Should return 401', async () => {
    await request(app)
      .delete(`/hometask_03/api/posts/${post1.id}`)
      .auth('admin', 'admin', { type: 'basic' })
      .expect(HTTP.UNAUTHORIZED_401);
  }); // posts = [post1]; blogs = [blog1];

  // TEST #3.14
  it('Delete post1. Should return 204', async () => {
    await request(app)
      .delete(`/hometask_03/api/posts/${post1.id}`)
      .auth('admin', 'qwerty', { type: 'basic' })
      .expect(HTTP.NO_CONTENT_204);
  }); // posts = []; blogs = [blog1];

  // TEST #3.15
  it('READ posts. Should return 200', async () => {
    await request(app)
      .get('/hometask_03/api/posts')
      .expect(HTTP.OK_200, []);
  }); // posts = []; blogs = [blog1];
});
