import { NextFunction, Request, Response } from "express";
import { param, validationResult } from "express-validator";
import { blogRepository } from "../repositories/blogs-repository";
import { postsRepository } from "../repositories/posts-repository";

// export const testBlogsParam = param('id')
//   .isIn(blogRepository.getBlogs().map(blog => blog.id));

export const testBlogsParam = param('id')
  .custom(value => {
    const blogsIds = blogRepository.getBlogs().map(blog => blog.id);
    // console.log(blogsIds)
    // console.log(value)
    if (blogsIds.indexOf(value) === -1) throw new Error("id is unexist");
    else return true;
  });

// export const testPostsParam = param('id')
//   .isIn(postsRepository.getPosts().map(post => post.id));

export const testPostsParam = param('id')
  .custom(value => {
    const postsIds = postsRepository.getPosts().map(post => post.id);
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
    return res.sendStatus(404); // TEST #2.5, #2.7, #2.12, #3.5, #3.7, #3.12
  } else next();
};