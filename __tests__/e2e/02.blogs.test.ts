import mongoose from "mongoose";
import { mongoUri } from "../../src/db";
import request from "supertest";
import { app } from "../../src/app";
import { HTTP } from "../../src/models";
import {
  URL,
  blogInput,
  badBlogInput,
  blogErrorResult,
  blog1,
  blogInputToUpdate,
  blogPostInput,
  badBlogPostInput,
  post1
} from './00.dataForTests';

let blog_01 = { ...blog1 };
let post_01 = { ...post1 };

describe(`${URL}/blogs`, () => {
  beforeAll(async () => {
    await mongoose.connect(mongoUri, { dbName: 'test' })
    await request(app).delete(`${URL}/testing/all-data`);
  }); // blogs = [];

  // TEST #2.1
  it('READ blogs. Status 200', async () => {
    await request(app)
      .get(`${URL}/blogs`)
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
      .post(`${URL}/blogs`)
      .auth('admin', 'admin', { type: 'basic' })
      .send(blogInput)
      .expect(HTTP.UNAUTHORIZED_401);
  }); // blogs = []; post = [];

  // TEST #2.3
  it('CREATE blog (bad request). Status 400', async () => {
    await request(app)
      .post(`${URL}/blogs`)
      .auth('admin', 'qwerty', { type: 'basic' })
      .send(badBlogInput)
      .expect(HTTP.BAD_REQUEST_400, blogErrorResult);
  }); // blogs = []; post = [];

  // TEST #2.4
  it('CREATE blog. Status 201', async () => {
    const response = await request(app)
      .post(`${URL}/blogs`)
      .auth('admin', 'qwerty', { type: 'basic' })
      .send(blogInput);

    const blog = response.body;

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.CREATED_201);
    expect(blog).toStrictEqual({
      id: expect.any(String),
      name: blogInput.name,
      description: blogInput.description,
      websiteUrl: blogInput.websiteUrl,
      createdAt: expect.any(String)
    });

    blog_01 = { ...blog };
  }); // blogs = [blog_01]; post = [];

  // TEST #2.5
  it('READ blog with id 100. Status 404', async () => {
    await request(app)
      .get(`${URL}/blogs/100`)
      .expect(HTTP.NOT_FOUND_404);
  }); // blogs = [blog_01]; post = [];

  // TEST #2.6 
  it('READ blog_01. Status 200', async () => {
    const response = await request(app)
      .get(`${URL}/blogs/${blog_01.id}`)

    const blog = response.body;

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.OK_200);
    expect(blog).toStrictEqual({
      id: blog_01.id,
      name: blog_01.name,
      description: blog_01.description,
      websiteUrl: blog_01.websiteUrl,
      createdAt: blog_01.createdAt
    });
  }); // blogs = [blog_01]; post = [];

  // TEST #2.7
  it('UPDATE blog with id 100. Status 404', async () => {
    await request(app)
      .put(`${URL}/blogs/100`)
      .auth('admin', 'qwerty', { type: 'basic' })
      .send(blogInputToUpdate)
      .expect(HTTP.NOT_FOUND_404);
  }); // blogs = [blog_01]; post = [];

  // TEST #2.8
  it('UPDATE blog_01 (unauthorized). Status 401', async () => {
    await request(app)
      .put(`${URL}/blogs/${blog_01.id}`)
      .auth('admin', 'admin', { type: 'basic' })
      .send(blogInputToUpdate)
      .expect(HTTP.UNAUTHORIZED_401);
  }); // blogs = [blog_01]; post = [];

  // TEST #2.9
  it('UPDATE blog_01 (bad request). Status 400', async () => {
    await request(app)
      .put(`${URL}/blogs/${blog_01.id}`)
      .auth('admin', 'qwerty', { type: 'basic' })
      .send(badBlogInput)
      .expect(HTTP.BAD_REQUEST_400, blogErrorResult);
  }); // blogs = [blog_01]; post = [];

  // TEST #2.10
  it('UPDATE blog_01. Status 204', async () => {
    await request(app)
      .put(`${URL}/blogs/${blog_01.id}`)
      .auth('admin', 'qwerty', { type: 'basic' })
      .send(blogInputToUpdate)
      .expect(HTTP.NO_CONTENT_204);

    blog_01.name = blogInputToUpdate.name;
    blog_01.description = blogInputToUpdate.description;
  }); // blogs = [blog_01]; post = [];

  // TEST #2.11
  it('READ blog_01. Status 200', async () => {
    const response = await request(app)
      .get(`${URL}/blogs/${blog_01.id}`);

    const blog = response.body;

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.OK_200);
    expect(blog).toStrictEqual({
      id: blog_01.id,
      createdAt: expect.any(String),
      ...blogInputToUpdate
    });
  }); // blogs = [blog_01]; post = [];

  // TEST #2.12
  it('GET posts of blog 100. Status 404', async () => {
    await request(app)
      .get(`${URL}/blogs/100/posts`)
      .expect(HTTP.NOT_FOUND_404);
  }); // blogs = [blog_01]; post = [];

  // TEST #2.13
  it('GET posts of blog_01. Status 200', async () => {
    // console.log(blog_01.id)
    await request(app)
      .get(`${URL}/blogs/${blog_01.id}/posts`)
      .expect(HTTP.OK_200, {
        pagesCount: 0,
        page: 1,
        pageSize: 10,
        totalCount: 0,
        items: []
      });
  }); // blogs = [blog_01]; post = [];

  // TEST #2.14
  it('POST post for blog 100. Status 404', async () => {
    await request(app)
      .post(`${URL}/blogs/100/posts`)
      .auth('admin', 'qwerty', { type: 'basic' })
      .send(blogPostInput)
      .expect(HTTP.NOT_FOUND_404);
  }); // blogs = [blog_01]; post = [];

  // TEST #2.15
  it('POST post for blog_01 (unauthorized). Status 401', async () => {
    await request(app)
      .post(`${URL}/blogs/${blog_01.id}/posts`)
      .auth('admin', 'admin', { type: 'basic' })
      .send(blogPostInput)
      .expect(HTTP.UNAUTHORIZED_401);
  }); // blogs = [blog_01]; post = [];

  // TEST #2.16
  it('POST post for blog_01 (bad request). Status 400', async () => {
    await request(app)
      .post(`${URL}/blogs/${blog_01.id}/posts`)
      .auth('admin', 'qwerty', { type: 'basic' })
      .send(badBlogPostInput)
      .expect(HTTP.BAD_REQUEST_400);
  }); // blogs = [blog_01]; post = [];

  // TEST #2.17
  it('POST post for blog_01. Status 201', async () => {
    const response = await request(app)
      .post(`${URL}/blogs/${blog_01.id}/posts`)
      .auth('admin', 'qwerty', { type: 'basic' })
      .send(blogPostInput);

    const post = response.body;

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.CREATED_201);
    expect(post).toStrictEqual({
      id: expect.any(String),
      title: blogPostInput.title,
      shortDescription: blogPostInput.shortDescription,
      content: blogPostInput.content,
      blogId: blog_01.id,
      blogName: blog_01.name,
      createdAt: expect.any(String),
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
        newestLikes: []
      }
    });

    post_01 = { ...post };
  }); // blogs = [blog_01]; post = [post_01];

  // TEST #2.18
  it('GET posts of blog_01. Status 200', async () => {
    await request(app)
      .get(`${URL}/blogs/${blog_01.id}/posts`)
      .expect(HTTP.OK_200, {
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 1,
        items: [post_01]
      });
  }); // blogs = [blog_01]; post = [post_01];

  // TEST #2.19
  it('Delete blog with id 100. Status 404', async () => {
    await request(app)
      .delete(`${URL}/blogs/100`)
      .auth('admin', 'qwerty', { type: 'basic' })
      .expect(HTTP.NOT_FOUND_404);
  }); // blogs = [blog_01]; post = [post_01];

  // TEST #2.20
  it('Delete blog_01 (unauthorized). Status 401', async () => {
    await request(app)
      .delete(`${URL}/blogs/${blog_01.id}`)
      .auth('admin', 'admin', { type: 'basic' })
      .expect(HTTP.UNAUTHORIZED_401);
  }); // blogs = [blog_01]; post = [post_01];

  // TEST #2.21
  it('Delete blog_01. Status 204', async () => {
    await request(app)
      .delete(`${URL}/blogs/${blog_01.id}`)
      .auth('admin', 'qwerty', { type: 'basic' })
      .expect(HTTP.NO_CONTENT_204);
  }); // blogs = []; post = [];

  // TEST #2.22
  it('READ blogs. Status 200', async () => {
    await request(app)
      .get(`${URL}/blogs`)
      .expect(HTTP.OK_200, {
        pagesCount: 0,
        page: 1,
        pageSize: 10,
        totalCount: 0,
        items: []
      });
  }); // blogs = []; post = [];
});