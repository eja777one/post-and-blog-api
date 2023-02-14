import mongoose from "mongoose";
import { mongoUri } from "../../src/db";
import request from "supertest";
import { app } from "../../src/app";
import { HTTP } from '../../src/models';
import {
  blog1,
  blogInput,
  URL,
  postInput1,
  postInput1ToUpdate,
  badPostInput,
  postErrorResult,
  post1,
  userInput1,
  user1,
  loginInput1,
  token1,
  commentInput,
  comment1
} from './00.dataForTests';

let blog_01 = { ...blog1 };
let post_01 = { ...post1 };
let user_01 = { ...user1 };
let token_01 = { ...token1 };
let comment_01 = { ...comment1 };
let postInput = { ...postInput1 };
let postInputToUpdate = { ...postInput1ToUpdate };

describe(`${URL}/posts`, () => {
  beforeAll(async () => {
    await mongoose.connect(mongoUri, { dbName: 'test' })
    await request(app).delete(`${URL}/testing/all-data`);
  }); // blogs = []; posts = []; users = []; comments = [];

  // TEST #000
  it('CREATE blog FOR TEST. Status 201', async () => {
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

    blog_01 = blog;

    postInput.blogId = blog_01.id;
    postInputToUpdate.blogId = blog_01.id;
  }); // blogs = [blog_01]; posts = []; users = []; comments = [];

  // TEST #3.1
  it('READ posts. Status 200', async () => {
    await request(app)
      .get(`${URL}/posts`)
      .expect(HTTP.OK_200, {
        pagesCount: 0,
        page: 1,
        pageSize: 10,
        totalCount: 0,
        items: []
      });
  }); // blogs = [blog_01]; posts = []; users = []; comments = [];

  // TEST #3.2
  it('CREATE post_01 for blog_01 (unauthorized). Status 401', async () => {
    await request(app)
      .post(`${URL}/posts`)
      .auth('admin', 'admin', { type: 'basic' })
      .send(postInput)
      .expect(HTTP.UNAUTHORIZED_401);
  }); // blogs = [blog_01]; posts = []; users = []; comments = [];

  // TEST #3.3
  it('CREATE post_01 for blog_01 (bad request). Status 400', async () => {
    await request(app)
      .post(`${URL}/posts`)
      .auth('admin', 'qwerty', { type: 'basic' })
      .send(badPostInput)
      .expect(HTTP.BAD_REQUEST_400, postErrorResult);
  }); // blogs = [blog_01]; posts = []; users = []; comments = [];

  // TEST #3.4
  it('CREATE post_01 for blog_01. Status 201', async () => {
    const response = await request(app)
      .post(`${URL}/posts`)
      .auth('admin', 'qwerty', { type: 'basic' })
      .send(postInput);

    const post = response.body;

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.CREATED_201);
    expect(post).toStrictEqual({
      id: expect.any(String),
      title: postInput.title,
      shortDescription: postInput.shortDescription,
      content: postInput.content,
      blogId: postInput.blogId,
      blogName: blog_01.name,
      createdAt: expect.any(String),
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
        newestLikes: []
      }
    });

    post_01 = post;
  }); // blogs = [blog_01]; posts = [post_01]; users = []; comments = [];

  // TEST #3.5
  it('READ post with id 100. Status 404', async () => {
    await request(app)
      .get(`${URL}/posts/100`)
      .expect(HTTP.NOT_FOUND_404);
  }); // blogs = [blog_01]; posts = [post_01]; users = []; comments = [];

  // TEST #3.6
  it('READ post_01. Status 200', async () => {
    const response = await request(app)
      .get(`${URL}/posts/${post_01.id}`)

    const post = response.body;

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.OK_200);
    expect(post).toStrictEqual({
      id: post_01.id,
      title: post_01.title,
      shortDescription: post_01.shortDescription,
      content: post_01.content,
      blogId: post_01.blogId,
      blogName: blog_01.name,
      createdAt: post_01.createdAt,
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
        newestLikes: []
      }
    });
  }); // blogs = [blog_01]; posts = [post_01]; users = []; comments = [];

  // TEST #3.7
  it('UPDATE post with id 100. Status 404', async () => {
    await request(app)
      .put(`${URL}/posts/100`)
      .auth('admin', 'qwerty', { type: 'basic' })
      .send(postInputToUpdate)
      .expect(HTTP.NOT_FOUND_404);
  }); // blogs = [blog_01]; posts = [post_01]; users = []; comments = [];

  // TEST #3.8
  it('UPDATE post_01 (unauthorized). Status 401', async () => {
    await request(app)
      .put(`${URL}/posts/${post_01.id}`)
      .auth('admin', 'admin', { type: 'basic' })
      .send(postInputToUpdate)
      .expect(HTTP.UNAUTHORIZED_401);
  }); // blogs = [blog_01]; posts = [post_01]; users = []; comments = [];

  // TEST #3.9
  it('UPDATE post_01 (bad request). Status 400', async () => {
    await request(app)
      .put(`${URL}/posts/${post_01.id}`)
      .auth('admin', 'qwerty', { type: 'basic' })
      .send(badPostInput)
      .expect(HTTP.BAD_REQUEST_400, postErrorResult);
  }); // blogs = [blog_01]; posts = [post_01]; users = []; comments = [];

  // TEST #3.10
  it('UPDATE post_01. Status 204', async () => {
    await request(app)
      .put(`${URL}/posts/${post_01.id}`)
      .auth('admin', 'qwerty', { type: 'basic' })
      .send(postInputToUpdate)
      .expect(HTTP.NO_CONTENT_204);
  }); // blogs = [blog_01]; posts = [post_01]; users = []; comments = [];

  // TEST #3.11
  it('READ post_01. Status 200', async () => {
    const response = await request(app)
      .get(`${URL}/posts/${post_01.id}`)

    const post = response.body;

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.OK_200);
    expect(post).toStrictEqual({
      id: post_01.id,
      blogName: blog_01.name,
      createdAt: expect.any(String),
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
        newestLikes: []
      },
      ...postInputToUpdate
    });
  }); // blogs = [blog_01]; posts = [post_01]; users = []; comments = [];

  // TEST #3.12
  it('GET comments of post with id 100. Status 404', async () => {
    await request(app)
      .get(`${URL}/posts/100/comments`)
      .expect(HTTP.NOT_FOUND_404);
  }); // blogs = [blog_01]; posts = [post_01]; users = []; comments = [];

  // TEST #3.13
  it('GET comments of post_01. Status 200', async () => {
    await request(app)
      .get(`${URL}/posts/${post_01.id}/comments`)
      .expect(HTTP.OK_200, {
        pagesCount: 0,
        page: 1,
        pageSize: 10,
        totalCount: 0,
        items: []
      });
  }); // blogs = [blog_01]; posts = [post_01]; users = []; comments = [];

  // TEST #000
  it('Create user_01 to creaete comment. Status 201', async () => {
    const response = await request(app)
      .post(`${URL}/users`)
      .auth('admin', 'qwerty', { type: 'basic' })
      .send(userInput1)

    const user = response.body;

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.CREATED_201);
    expect(user).toStrictEqual({
      id: expect.any(String),
      login: userInput1.login,
      email: userInput1.email,
      createdAt: expect.any(String)
    });

    user_01 = { ...user };
  }); // blogs = [blog_01]; posts = [post_01]; users = [user_01]; comments = [];

  // TEST #000
  it('Login user_01. Status 200', async () => {
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
  }); // blogs = [blog_01]; posts = [post_01]; users = [user_01]; comments = [];

  // TEST #3.16
  it('Create comment for post with id 100. Status 404', async () => {
    await request(app)
      .post(`${URL}/posts/100/comments`)
      .set('Authorization', `Bearer ${token_01.accessToken}`)
      .send(commentInput)
      .expect(HTTP.NOT_FOUND_404)
  }); // blogs = [blog_01]; posts = [post_01]; users = [user_01]; comments = [];

  // TEST #3.17
  it('Create comment_01 for post_01. Status 401', async () => {
    await request(app)
      .post(`${URL}/posts/${post_01.id}/comments`)
      .set('Authorization', 'token_01.accessToken')
      .send(commentInput)
      .expect(HTTP.UNAUTHORIZED_401)
  }); // blogs = [blog_01]; posts = [post_01]; users = [user_01]; comments = [];

  // TEST #3.18
  it('Create comment_01 for post_01. Status 400', async () => {
    await request(app)
      .post(`${URL}/posts/${post_01.id}/comments`)
      .set('Authorization', `Bearer ${token_01.accessToken}`)
      .send({ content: 'content' })
      .expect(HTTP.BAD_REQUEST_400)
  }); // blogs = [blog_01]; posts = [post_01]; users = [user_01]; comments = [];

  // TEST #3.19
  it('Create comment_01 for post_01. Status 201', async () => {
    const response = await request(app)
      .post(`${URL}/posts/${post_01.id}/comments`)
      .set('Authorization', `Bearer ${token_01.accessToken}`)
      .send(commentInput)

    const comment = response.body;

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.CREATED_201);
    expect(comment).toStrictEqual({
      commentatorInfo: {
        userId: user_01.id,
        userLogin: user_01.login,
      },
      id: expect.any(String),
      content: commentInput.content,
      createdAt: expect.any(String),
      likesInfo: {
        dislikesCount: 0,
        likesCount: 0,
        myStatus: "None"
      }
    });

    comment_01 = { ...comment };
  }); // blogs = [blog_01]; posts = [post_01]; users = [user_01];
  // comments = [comment_01];

  // TEST #3.20
  it('GET comments of post_01. Status 200', async () => {
    await request(app)
      .get(`${URL}/posts/${post_01.id}/comments`)
      .expect(HTTP.OK_200, {
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 1,
        items: [comment_01]
      });
  }); // blogs = [blog_01]; posts = [post_01]; users = [user_01]; 
  // comments = [comment_01];

  // TEST #3.21
  it('Change like status of post_100 by user_01. Status 404', async () => {
    await request(app)
      .put(`${URL}/posts/{post_01.id}/like-status`)
      .set('Authorization', `Bearer ${token_01.accessToken}`)
      .send({ likeStatus: 'Like' })
      .expect(HTTP.NOT_FOUND_404);
  }); // blogs = [blog_01]; posts = [post_01]; users = [user_01]; 
  // comments = [comment_01];

  // TEST #3.22
  it('Change like status of post_01 by user_100. Status 401', async () => {
    await request(app)
      .put(`${URL}/posts/${post_01.id}/like-status`)
      .set('Authorization', `Bearer {token_01.accessToken}`)
      .send({ likeStatus: 'Like' })
      .expect(HTTP.UNAUTHORIZED_401);
  }); // blogs = [blog_01]; posts = [post_01]; users = [user_01]; 
  // comments = [comment_01];

  // TEST #3.23
  it('Change like status of post_01 by user_01. Status 400', async () => {
    await request(app)
      .put(`${URL}/posts/${post_01.id}/like-status`)
      .set('Authorization', `Bearer ${token_01.accessToken}`)
      .send({ likeStatus: 'Well' })
      .expect(HTTP.BAD_REQUEST_400, {
        errorsMessages: [{
          message: 'incorrect likeStatus',
          field: 'likeStatus'
        }]
      });
  }); // blogs = [blog_01]; posts = [post_01]; users = [user_01]; 
  // comments = [comment_01];

  // TEST #3.24
  it('Change like status of post_01 by user_01. Status 204', async () => {
    await request(app)
      .put(`${URL}/posts/${post_01.id}/like-status`)
      .set('Authorization', `Bearer ${token_01.accessToken}`)
      .send({ likeStatus: 'Like' })
      .expect(HTTP.NO_CONTENT_204);
  }); // blogs = [blog_01]; posts = [post_01]; users = [user_01]; 
  // comments = [comment_01];

  // TEST #3.25
  it('READ post_01. Status 200', async () => {
    const response = await request(app)
      .get(`${URL}/posts/${post_01.id}`)

    const post = response.body;

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.OK_200);
    expect(post).toStrictEqual({
      id: post_01.id,
      title: post_01.title,
      shortDescription: post_01.shortDescription,
      content: post_01.content,
      blogId: post_01.blogId,
      blogName: blog_01.name,
      createdAt: post_01.createdAt,
      extendedLikesInfo: {
        likesCount: 1,
        dislikesCount: 0,
        myStatus: 'None',
        newestLikes: [{
          addedAt: expect.any(String),
          userId: user_01.id,
          login: user_01.login
        }]
      }
    });
  }); // blogs = [blog_01]; posts = [post_01]; users = [user_01]; 
  // comments = [comment_01];

  // TEST #3.26
  it('Change like status of post_01 by user_01. Status 204', async () => {
    await request(app)
      .put(`${URL}/posts/${post_01.id}/like-status`)
      .set('Authorization', `Bearer ${token_01.accessToken}`)
      .send({ likeStatus: 'None' })
      .expect(HTTP.NO_CONTENT_204);
  }); // blogs = [blog_01]; posts = [post_01]; users = [user_01]; 
  // comments = [comment_01];

  // TEST #3.27
  it('READ post_01. Status 200', async () => {
    const response = await request(app)
      .get(`${URL}/posts/${post_01.id}`)

    const post = response.body;

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.OK_200);
    expect(post).toStrictEqual({
      id: post_01.id,
      title: post_01.title,
      shortDescription: post_01.shortDescription,
      content: post_01.content,
      blogId: post_01.blogId,
      blogName: blog_01.name,
      createdAt: post_01.createdAt,
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
        newestLikes: []
      }
    });
  }); // blogs = [blog_01]; posts = [post_01]; users = [user_01]; 
  // comments = [comment_01];

  // TEST #3.28 
  it('Change like status of post_01 by user_01. Status 204', async () => {
    await request(app)
      .put(`${URL}/posts/${post_01.id}/like-status`)
      .set('Authorization', `Bearer ${token_01.accessToken}`)
      .send({ likeStatus: 'Dislike' })
      .expect(HTTP.NO_CONTENT_204);
  }); // blogs = [blog_01]; posts = [post_01]; users = [user_01]; 
  // comments = [comment_01];

  // TEST #3.29
  it('READ post_01. Status 200', async () => {
    const response = await request(app)
      .get(`${URL}/posts/${post_01.id}`)
      .set('Authorization', `Bearer ${token_01.accessToken}`)

    const post = response.body;

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.OK_200);
    expect(post).toStrictEqual({
      id: post_01.id,
      title: post_01.title,
      shortDescription: post_01.shortDescription,
      content: post_01.content,
      blogId: post_01.blogId,
      blogName: blog_01.name,
      createdAt: post_01.createdAt,
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 1,
        myStatus: 'Dislike',
        newestLikes: []
      }
    });
  }); // blogs = [blog_01]; posts = [post_01]; users = [user_01]; 
  // comments = [comment_01];

  // TEST #3.30
  it('Delete post with id 100. Status 404', async () => {
    await request(app)
      .delete(`${URL}/posts/100`)
      .auth('admin', 'qwerty', { type: 'basic' })
      .expect(HTTP.NOT_FOUND_404);
  }); // blogs = [blog_01]; posts = [post_01]; users = [user_01]; 
  // comments = [comment_01];

  // TEST #3.31
  it('Delete post_01 (unauthorized). Status 401', async () => {
    await request(app)
      .delete(`${URL}/posts/${post_01.id}`)
      .auth('admin', 'admin', { type: 'basic' })
      .expect(HTTP.UNAUTHORIZED_401);
  }); // blogs = [blog_01]; posts = [post_01]; users = [user_01]; 
  // comments = [comment_01];

  // TEST #3.32
  it('Delete post_01. Status 204', async () => {
    await request(app)
      .delete(`${URL}/posts/${post_01.id}`)
      .auth('admin', 'qwerty', { type: 'basic' })
      .expect(HTTP.NO_CONTENT_204);
  }); // blogs = [blog_01]; posts = []; users = [user_01]; 
  // comments = [comment_01];

  // TEST #3.33
  it('READ posts. Status 200', async () => {
    await request(app)
      .get(`${URL}/posts`)
      .expect(HTTP.OK_200, {
        pagesCount: 0,
        page: 1,
        pageSize: 10,
        totalCount: 0,
        items: []
      });
  }); // blogs = [blog_01]; posts = []; users = [user_01]; 
  // comments = [comment_01];
});