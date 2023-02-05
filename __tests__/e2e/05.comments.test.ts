import mongoose from "mongoose";
import { mongoUri } from "../../src/repositories/00.db";
import request from "supertest";
import { app } from "../../src/app";
import { HTTP } from "../../src/models";
import {
  blog1,
  blogInput,
  blogPostInput,
  comment1,
  commentInput,
  commentInputToUpdate,
  loginInput1,
  loginInput2,
  post1,
  token1,
  token2,
  URL,
  user1,
  user2,
  userInput1,
  userInput2
} from './00.dataForTests';

let blog_01 = { ...blog1 };
let post_01 = { ...post1 };
let user_01 = { ...user1 };
let user_02 = { ...user2 };
let token_01 = { ...token1 };
let token_02 = { ...token2 };
let comment_01 = { ...comment1 };

describe(`${URL}/comments`, () => {
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
  }); // blogs = [blog_01]; posts = []; users = []; comments = [];

  // TEST #000
  it('CREATE post for blog_01. Status 201', async () => {
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
      createdAt: expect.any(String)
    });

    post_01 = post;
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
  it('Create user_02 to creaete comment. Status 201', async () => {
    const response = await request(app)
      .post(`${URL}/users`)
      .auth('admin', 'qwerty', { type: 'basic' })
      .send(userInput2);

    const user = response.body;

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.CREATED_201);
    expect(user).toStrictEqual({
      id: expect.any(String),
      login: userInput2.login,
      email: userInput2.email,
      createdAt: expect.any(String)
    });

    user_02 = { ...user };
  }); // blogs = [blog_01]; posts = [post_01]; users = [user_01]; comments = [];

  // TEST #000
  it('Login user_01. Status 200', async () => {
    const response = await request(app)
      .post(`${URL}/auth/login`)
      .send(loginInput1);

    const accessToken = response.body;

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.OK_200);
    expect(accessToken).toStrictEqual({
      accessToken: expect.any(String),
    });

    token_01 = { ...accessToken };
  }); // blogs = [blog_01]; posts = [post_01]; users = [user_01]; comments = [];

  // TEST #000
  it('Login user_02. Status 200', async () => {
    const response = await request(app)
      .post(`${URL}/auth/login`)
      .send(loginInput2)

    const accessToken = response.body;

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.OK_200);
    expect(accessToken).toStrictEqual({
      accessToken: expect.any(String),
    });

    token_02 = { ...accessToken };
  }); // blogs = [blog_01]; posts = [post_01]; users = [user_01, user_02]; comments = [];

  // TEST #000
  it('Create comment_01 for post_01 by user_01. Status 201', async () => {
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

    comment_01 = comment;
  }); // blogs = [blog_01]; posts = [post_01]; users = [user_01, user_02]; comments = [comment_01];

  // TEST #5.1
  it('Update comment with id 100. Status 404', async () => {
    await request(app)
      .put(`${URL}/comments/100`)
      .set('Authorization', `Bearer ${token_01.accessToken}`)
      .send(commentInputToUpdate)
      .expect(HTTP.NOT_FOUND_404)
  }); // blogs = [blog_01]; posts = [post_01]; users = [user_01, user_02]; comments = [comment_01];

  // TEST #5.2
  it('Update comment_01. Status 403', async () => {
    await request(app)
      .put(`${URL}/comments/${comment_01.id}`)
      .set('Authorization', `Bearer ${token_02.accessToken}`)
      .send(commentInputToUpdate)
      .expect(HTTP.FORBIDDEN_403)
  }); // blogs = [blog_01]; posts = [post_01]; users = [user_01, user_02]; comments = [comment_01];

  // TEST #5.3
  it('Update comment_01. Status 401', async () => {
    await request(app)
      .put(`${URL}/comments/${comment_01.id}`)
      .set('Authorization', `Bearer token_01.accessToken`)
      .send(commentInputToUpdate)
      .expect(HTTP.UNAUTHORIZED_401)
  }); // blogs = [blog_01]; posts = [post_01]; users = [user_01, user_02]; comments = [comment_01];

  // TEST #5.4
  it('Update comment_01. Status 400', async () => {
    await request(app)
      .put(`${URL}/comments/${comment_01.id}`)
      .set('Authorization', `Bearer ${token_01.accessToken}`)
      .send({ content: 'bad content' })
      .expect(HTTP.BAD_REQUEST_400)
  }); // blogs = [blog_01]; posts = [post_01]; users = [user_01, user_02]; comments = [comment_01];

  // TEST #5.5
  it('Update comment_01. Status 204', async () => {
    await request(app)
      .put(`${URL}/comments/${comment_01.id}`)
      .set('Authorization', `Bearer ${token_01.accessToken}`)
      .send(commentInputToUpdate)
      .expect(HTTP.NO_CONTENT_204)

    comment_01.content = commentInputToUpdate.content;
  }); // blogs = [blog_01]; posts = [post_01]; users = [user_01, user_02]; comments = [comment_01];

  // TEST #5.6
  it('Like comment_100 by User_01. Status 404', async () => {
    await request(app)
      .put(`${URL}/comments/{comment_01.id}/like-status`)
      .set('Authorization', `Bearer ${token_01.accessToken}`)
      .send({ likeStatus: "Like" })
      .expect(HTTP.NOT_FOUND_404)
  }); // blogs = [blog_01]; posts = [post_01]; users = [user_01, user_02]; comments = [comment_01];

  // TEST #5.7
  it('Like comment_01 by User_01. Status 401', async () => {
    await request(app)
      .put(`${URL}/comments/${comment_01.id}/like-status`)
      .set('Authorization', `Bearer {token_01.accessToken}`)
      .send({ likeStatus: "Like" })
      .expect(HTTP.UNAUTHORIZED_401)
  }); // blogs = [blog_01]; posts = [post_01]; users = [user_01, user_02]; comments = [comment_01];

  // TEST #5.8
  it('Like comment_01 by User_01. Status 400', async () => {
    await request(app)
      .put(`${URL}/comments/${comment_01.id}/like-status`)
      .set('Authorization', `Bearer ${token_01.accessToken}`)
      .send({ likeStatus: "I don't like" })
      .expect(HTTP.BAD_REQUEST_400)
  }); // blogs = [blog_01]; posts = [post_01]; users = [user_01, user_02]; comments = [comment_01];

  // TEST #5.9
  it('Like comment_01 by User_01. Status 204', async () => {
    await request(app)
      .put(`${URL}/comments/${comment_01.id}/like-status`)
      .set('Authorization', `Bearer ${token_01.accessToken}`)
      .send({ likeStatus: "Like" })
      .expect(HTTP.NO_CONTENT_204)
  }); // blogs = [blog_01]; posts = [post_01]; users = [user_01, user_02]; comments = [comment_01];

  // TEST #5.10
  it('Delete Like for comment_01 by User_01. Status 204', async () => {
    await request(app)
      .put(`${URL}/comments/${comment_01.id}/like-status`)
      .set('Authorization', `Bearer ${token_01.accessToken}`)
      .send({ likeStatus: "None" })
      .expect(HTTP.NO_CONTENT_204)
  }); // blogs = [blog_01]; posts = [post_01]; users = [user_01, user_02]; comments = [comment_01];

  // TEST #5.11
  it('Dislike comment_01 by User_01. Status 204', async () => {
    await request(app)
      .put(`${URL}/comments/${comment_01.id}/like-status`)
      .set('Authorization', `Bearer ${token_01.accessToken}`)
      .send({ likeStatus: "Dislike" })
      .expect(HTTP.NO_CONTENT_204)
  }); // blogs = [blog_01]; posts = [post_01]; users = [user_01, user_02]; comments = [comment_01];

  // TEST #5.12
  it('Dislike comment_01 by User_02. Status 204', async () => {
    await request(app)
      .put(`${URL}/comments/${comment_01.id}/like-status`)
      .set('Authorization', `Bearer ${token_02.accessToken}`)
      .send({ likeStatus: "Dislike" })
      .expect(HTTP.NO_CONTENT_204)
  }); // blogs = [blog_01]; posts = [post_01]; users = [user_01, user_02]; comments = [comment_01];

  // TEST #5.13
  it('Get comment_01. Status 200', async () => {
    const response = await request(app)
      .get(`${URL}/comments/${comment_01.id}`)

    const comment = response.body;

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.OK_200);
    expect(comment).toStrictEqual({
      commentatorInfo: {
        userId: user_01.id,
        userLogin: user_01.login,
      },
      id: expect.any(String),
      content: commentInput.content,
      createdAt: expect.any(String),
      likesInfo: {
        dislikesCount: 2,
        likesCount: 0,
        myStatus: "Dislike"
      }
    });
  }); // blogs = [blog_01]; posts = [post_01]; users = [user_01, user_02]; comments = [comment_01];

  // TEST #5.14
  it('Get comment with id 100. Status 404', async () => {
    const response = await request(app)
      .get(`${URL}/comments/100`)
      .expect(HTTP.NOT_FOUND_404)
  }); // blogs = [blog_01]; posts = [post_01]; users = [user_01, user_02]; comments = [comment_01];

  // TEST #5.15
  it('Delete comment with id 100. Status 404', async () => {
    await request(app)
      .delete(`${URL}/comments/100`)
      .set('Authorization', `Bearer ${token_01.accessToken}`)
      .expect(HTTP.NOT_FOUND_404)
  }); // blogs = [blog_01]; posts = [post_01]; users = [user_01, user_02]; comments = [comment_01];

  // TEST #5.16
  it('Delete comment_01. Status 403', async () => {
    await request(app)
      .delete(`${URL}/comments/${comment_01.id}`)
      .set('Authorization', `Bearer ${token_02.accessToken}`)
      .expect(HTTP.FORBIDDEN_403)
  }); // blogs = [blog_01]; posts = [post_01]; users = [user_01, user_02]; comments = [comment_01];

  // TEST #5.17
  it('Delete comment_01. Status 401', async () => {
    await request(app)
      .delete(`${URL}/comments/${comment_01.id}`)
      .set('Authorization', `Bearer token_02.accessToken`)
      .expect(HTTP.UNAUTHORIZED_401)
  }); // blogs = [blog_01]; posts = [post_01]; users = [user_01, user_02]; comments = [comment_01];

  // TEST #5.18
  it('Delete comment_01. Status 204', async () => {
    await request(app)
      .delete(`${URL}/comments/${comment_01.id}`)
      .set('Authorization', `Bearer ${token_01.accessToken}`)
      .expect(HTTP.NO_CONTENT_204)
  }); // blogs = [blog_01]; posts = [post_01]; users = [user_01, user_02]; comments = [];

  // TEST #5.19
  it('Get comment1. Status 404', async () => {
    await request(app)
      .get(`${URL}/comments/${comment_01.id}`)
      .expect(HTTP.NOT_FOUND_404)
  }); // blogs = [blog_01]; posts = [post_01]; users = [user_01, user_02]; comments = [];
});