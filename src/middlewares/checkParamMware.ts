import { NextFunction, Request, Response } from "express";
import { param, validationResult } from "express-validator";
import { blogRepository } from "../repositories/blogs-db-repository";
import { postsRepository } from "../repositories/posts-db-repository";

export const testBlogsParamId = param('id')
  .custom(async value => {

    const blogsIds = await blogRepository.getBlogs().
      then(value => value.map(el => el._id.toString()));

    console.log(blogsIds)
    console.log(value)
    if (blogsIds.indexOf(value) === -1) throw new Error("id is unexist");
    else return true;
  });

export const testBlogsParamBlogID = param('blogId')
  .custom(async value => {

    const blogsIds = await blogRepository.getBlogs()
      .then(value => value.map(el => el._id.toString()));

    console.log(blogsIds)
    console.log(value)
    if (blogsIds.indexOf(value) === -1) throw new Error("blogId is unexist");
    else return true;
  });

export const testPostsParam = param('id')
  .custom(async value => {
    // const postsIds = postsRepository.getPosts().map(post => post.id);
    const postsIds = await postsRepository.getPosts()
      .then(value => value.map(el => el._id.toString()));
    // console.log(postsIds)
    // console.log(value)
    if (postsIds.indexOf(value) === -1) throw new Error("id is unexist");
    else return true;
  });

export const checkParamMware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  // console.log(errors);
  if (!errors.isEmpty()) {
    console.log(errors);
    return res.sendStatus(404); // TEST #2.5, #2.7, #2.91, #2.93, #2.12, #3.5, #3.7, #3.12
  } else next();
};