import { NextFunction, Request, Response } from "express";
import { checkSchema, validationResult } from "express-validator";
import { blogRepository } from "../repositories/blogs-repository";

export const testBlogsReqBody = checkSchema({
  name: {
    isString: true,
    trim: { options: [' '] },
    isLength: {
      options: { max: 15 }
    },
  },
  description: {
    isString: true,
    trim: { options: [' '] },
    isLength: {
      options: { max: 500 }
    },
  },
  websiteUrl: {
    isString: true,
    matches: {
      options: new RegExp('^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+\.)*\/?$')
    },
    isLength: {
      options: { max: 100 }
    },
  },
});

export const testPostsReqBody = checkSchema({
  title: {
    isString: true,
    trim: { options: [' '] },
    isLength: {
      options: { max: 30 }
    },
  },
  shortDescription: {
    isString: true,
    trim: { options: [' '] },
    isLength: {
      options: { max: 100 }
    },
  },
  content: {
    isString: true,
    trim: { options: [' '] },
    isLength: {
      options: { max: 1000 }
    },
  },
  blogId: {
    isString: true,
    trim: { options: [' '] },
    custom: {
      options: (value, { req, location, path }) => {
        const blog = blogRepository.getBlogById(value);
        if (!blog) throw new Error('Blog id is unexist')
        else return true;
      }
    }
  },
});

export const checkReqBodyMware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const myErrors: any = []; // BAD BAD BAD

    for (let el of errors.array()) {
      const error = {
        message: `incorrect ${el.param}`,
        field: el.param
      };
      myErrors.push(error);
    }
    return res.status(400).json({ errorsMessages: myErrors }); // TEST #2.3, #2.9, #3.3, #3.9
  } else next();
};