import {
  BlogViewModel,
  PostViewModel,
  BlogInputModel,
  CommentViewModel,
  UserViewModel,
  LoginInputModel,
  UserInputModel,
  CommentInputModel
} from '../../src/models';

export const URL = '/hometask_10/api';

// for Blogs

export let blog1: BlogViewModel;
export let post1: PostViewModel;

export const blogInput: BlogInputModel = {
  name: "string",
  description: "string",
  websiteUrl: "https://www.google.com/"
};

export const badBlogInput = {
  name: 3,
  description: "string",
  websiteUrl: "https://www.google.com/"
};

export const blogErrorResult = {
  errorsMessages: [
    {
      message: `incorrect name`,
      field: 'name'
    }
  ]
};

export const blogInputToUpdate = {
  name: "new",
  description: "new",
  websiteUrl: "https://www.google.com/"
};

export const blogPostInput = {
  title: "string",
  shortDescription: "string",
  content: "string",
};

export const badBlogPostInput = {
  title: "string",
  shortDescription: "string",
};

// for comments

export let user1: UserViewModel;
export let token1: { accessToken: string };
export let user2: UserViewModel;
export let token2: { accessToken: string };
export let comment1: CommentViewModel;

export const userInput1: UserInputModel = {
  login: 'user1',
  password: "user1pass",
  email: 'eja777one@gmail.com'
};

export const badUserInput1 = {
  login: 'user1',
  password: "user1pass",
  email: 'eja777one.com'
};

export const badRegEmailResending = {
  email: 'eja777one.com'
};

export const userErrorResult = {
  errorsMessages: [
    {
      message: `incorrect email`,
      field: 'email'
    }
  ]
};

export const codeErrorResult = {
  errorsMessages: [
    {
      message: `incorrect code`,
      field: 'code'
    }
  ]
};

export const userInput2: UserInputModel = {
  login: 'user2',
  password: "user2pass",
  email: 'pgs111213@yandex.ru'
};

export const loginInput1: LoginInputModel = {
  loginOrEmail: userInput1.login,
  password: userInput1.password
};

export const badLoginBody = {
  loginOrEmail: 424,
  password: userInput1.password
};

export const badLoginBody2 = {
  loginOrEmail: 'LOGIN',
  password: userInput1.password
};

export const loginInput2: LoginInputModel = {
  loginOrEmail: userInput2.login,
  password: userInput2.password
};

export const commentInput: CommentInputModel = {
  content: "stringstringstringst"
};

export const commentInputToUpdate: CommentInputModel = {
  content: "updateupdateupdateup"
};

// for posts

export const postInput1 = {
  title: "string",
  shortDescription: "string",
  content: "string",
  blogId: "string"
};

export const postInput1ToUpdate = {
  title: "string",
  shortDescription: "string",
  content: "string",
  blogId: "string"
};

export const badPostInput = {
  title: "string",
  shortDescription: "string",
  content: "string",
  blogId: "string"
};

export const postErrorResult = {
  errorsMessages: [
    {
      message: `incorrect blogId`,
      field: 'blogId'
    }
  ]
};
