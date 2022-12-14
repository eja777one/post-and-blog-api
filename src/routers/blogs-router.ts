import { Router, Request, Response } from "express";
import { testBlogsReqBody, checkReqBodyMware } from '../middlewares/checkReqBodyMware';
import { testBlogsParam, checkParamMware } from '../middlewares/checkParamMware';
import { testBaseAuth, checkAuthMware } from '../middlewares/checkAuthMware';
import { blogRepository } from '../repositories/blogs-repository';
import { HTTP } from '../HTTPStatusCodes';
import { BlogInputModel } from '../models';

export const blogsRouter = Router({});

blogsRouter.get('/', (req: Request, res: Response) => {
  const blogs = blogRepository.getBlogs()
  res.status(HTTP.OK_200).json(blogs); // TEST #2.1, #2.15
});

blogsRouter.post('/',
  testBaseAuth, checkAuthMware,
  testBlogsReqBody, checkReqBodyMware,
  (req: Request<BlogInputModel>, res: Response) => {
    const blog = blogRepository.addBlog(req.body);
    res.status(HTTP.CREATED_201).json(blog); // TEST #2.4
  });

blogsRouter.get('/:id',
  testBlogsParam, checkParamMware,
  (req: Request<{ id: string }>, res: Response) => {
    const blog = blogRepository.getBlogById(req.params.id);
    res.status(HTTP.OK_200).json(blog); // TEST #2.6, #2.11
  });

// blogsRouter.get('/:id',
//   (req: Request<{ id: string }>, res: Response) => {
//     const blog = blogRepository.getBlogById(req.params.id);

//     if (blog) res.status(HTTP.OK_200).json(blog); // TEST #2.6, #2.11
//     else res.status(HTTP.NOT_FOUND_404)
//   });

blogsRouter.put('/:id',
  testBaseAuth, checkAuthMware,
  testBlogsParam, checkParamMware,
  testBlogsReqBody, checkReqBodyMware,
  (req: Request<{ id: string }, BlogInputModel>, res: Response) => {
    blogRepository.updateBlog(req.params.id, req.body);
    res.sendStatus(HTTP.NO_CONTENT_204); // TEST #2.10
  });

blogsRouter.delete('/:id',
  testBaseAuth, checkAuthMware,
  testBlogsParam, checkParamMware,
  (req: Request<{ id: string }>, res: Response) => {
    blogRepository.deleteBlogById(req.params.id);
    res.sendStatus(HTTP.NO_CONTENT_204); // TEST #2.14
  });