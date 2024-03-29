import { BlogsQueryRepository }
  from '../features/blogs/infrastructure/blogsQRepo';
import { NextFunction, Request, Response } from "express";
import { checkSchema, validationResult } from "express-validator";
import { APIErrorResult, FieldError } from '../models';

const blogsQueryRepository = new BlogsQueryRepository();

export const testBlogsReqBody = checkSchema({
  name: {
    isString: true,
    trim: { options: [' '] },
    isLength: {
      options: { min: 1, max: 15 }
    },
  },
  description: {
    isString: true,
    trim: { options: [' '] },
    isLength: {
      options: { min: 1, max: 500 }
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
      options: { min: 1, max: 30 }
    },
  },
  shortDescription: {
    isString: true,
    trim: { options: [' '] },
    isLength: {
      options: { min: 1, max: 100 }
    },
  },
  content: {
    isString: true,
    trim: { options: [' '] },
    isLength: {
      options: { min: 1, max: 1000 }
    },
  },
  blogId: {
    isString: true,
    trim: { options: [' '] },
    custom: {
      options: async (value) => {
        const blog = await blogsQueryRepository.getBlog(value);
        if (!blog) throw new Error('Blog id is unexist');
        else return true;
      }
    }
  },
});

export const testPostsReqBodyNoBlogId = checkSchema({
  title: {
    isString: true,
    trim: { options: [' '] },
    isLength: {
      options: { min: 1, max: 30 }
    },
  },
  shortDescription: {
    isString: true,
    trim: { options: [' '] },
    isLength: {
      options: { min: 1, max: 100 }
    },
  },
  content: {
    isString: true,
    trim: { options: [' '] },
    isLength: {
      options: { min: 1, max: 1000 }
    },
  }
});

export const testLoginPassReqBody = checkSchema({
  loginOrEmail: { isString: true },
  password: { isString: true }
});

export const testCodeReqBody = checkSchema({
  code: {
    isString: true,
    matches: {
      options: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    },
  },
});

export const testEmailReqBody = checkSchema({
  email: {
    isString: true,
    matches: {
      options: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    },
  }
});

export const testAddUserReqBody = checkSchema({
  login: {
    isString: true,
    isLength: {
      options: { min: 3, max: 10 }
    },
    matches: {
      options: /^[a-zA-Z0-9_-]*$/
    },
  },
  password: {
    isString: true,
    isLength: {
      options: { min: 6, max: 20 }
    },
  },
  email: {
    isString: true,
    matches: {
      options: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    },
  }
});

export const testCommentBody = checkSchema({
  content: {
    isString: true,
    isLength: {
      options: { min: 20, max: 300 }
    }
  }
});

export const testLikeCommentBody = checkSchema({
  likeStatus: {
    isString: true,
    isIn: {
      options: [['None', 'Like', 'Dislike']]
    }
  }
})

export const testReqRecoveryPass = checkSchema({
  newPassword: {
    isString: true,
    isLength: {
      options: { min: 6, max: 20 }
    }
  },
  recoveryCode: {
    isString: true,
    matches: {
      options: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    },
  }
});

export const checkReqBodyMware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) return next();

  const rawErrors: string[] = [];

  for (let el of errors.array()) rawErrors.push(el.param);

  const tempErrors = Array.from(new Set(rawErrors));

  const myErrors = tempErrors.map(e => new FieldError(e));

  return res.status(400).json(new APIErrorResult(myErrors));
};