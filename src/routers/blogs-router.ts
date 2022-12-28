import { Router, Request, Response } from "express";
import { postsQueryRepository } from './../repositories/posts-query-repository';
import { blogsQueryRepository } from './../repositories/blogs-query-repository';
import { testBlogsReqBody, checkReqBodyMware, testPostsReqBodyNoBlogId } from '../middlewares/checkReqBodyMware';
import { checkIsObjectId } from '../middlewares/checkParamMware';
import { checkAuthMware } from '../middlewares/checkAuthMware';
import { blogServices } from '../domains/blogs-services';
import { BlogInputModel, HTTP, Paginator, BlogViewModel, PostViewModel, PostInputModelNoId } from '../models';
import { prepareQueries } from './mappers'

export const blogsRouter = Router({});

blogsRouter.get('/', async (
  req: Request,
  res: Response<Paginator<BlogViewModel>>
) => {
  const query = prepareQueries(req.query);
  const blogs = await blogsQueryRepository.getBlogsByQuery(query);
  res.status(HTTP.OK_200).json(blogs); // TEST #2.1, #2.15
});

blogsRouter.post('/',
  checkAuthMware,
  testBlogsReqBody, checkReqBodyMware,
  async (
    req: Request<BlogInputModel>,
    res: Response<BlogViewModel>
  ) => {
    const blogId = await blogServices.createBlog(req.body);
    const blog = await blogsQueryRepository.getBlogById(blogId);
    if (blog) res.status(HTTP.CREATED_201).json(blog); // TEST #2.4
  });

blogsRouter.get('/:id',
  checkIsObjectId,
  async (
    req: Request<{ id: string }>,
    res: Response<BlogViewModel>
  ) => {
    const blog = await blogsQueryRepository.getBlogById(req.params.id);
    if (blog) res.status(HTTP.OK_200).json(blog); // TEST #2.6, #2.11
    else res.sendStatus(HTTP.NOT_FOUND_404);
  });

blogsRouter.put('/:id',
  checkAuthMware,
  checkIsObjectId,
  testBlogsReqBody, checkReqBodyMware,
  async (
    req: Request<{ id: string }, BlogInputModel>,
    res: Response
  ) => {
    const updated = await blogServices.updateBlog(req.params.id, req.body);
    if (updated) res.sendStatus(HTTP.NO_CONTENT_204); // TEST #2.10
    else res.sendStatus(HTTP.NOT_FOUND_404);
  });

blogsRouter.delete('/:id',
  checkAuthMware,
  checkIsObjectId,
  async (req: Request<{ id: string }>, res: Response) => {
    const deleted = await blogServices.deleteBlogById(req.params.id);
    if (deleted) res.sendStatus(HTTP.NO_CONTENT_204); // TEST #2.14
    else res.sendStatus(HTTP.NOT_FOUND_404);
  });

blogsRouter.get('/:blogId/posts',
  checkIsObjectId,
  async (
    req: Request<{ blogId: string }>,
    res: Response<Paginator<PostViewModel>>
  ) => {
    const blog = blogsQueryRepository.getBlogById(req.params.blogId);
    if (!blog) res.sendStatus(HTTP.NOT_FOUND_404);
    const query = prepareQueries(req.query);
    const posts = await postsQueryRepository
      .getPostsByBlogId(req.params.blogId, query);
    return res.status(HTTP.OK_200).json(posts); // TEST #2.92, #2.97
  });

blogsRouter.post('/:blogId/posts',
  checkAuthMware,
  checkIsObjectId,
  testPostsReqBodyNoBlogId, checkReqBodyMware,
  async (
    req: Request<{ blogId: string }, PostInputModelNoId>,
    res: Response<PostViewModel>
  ) => {
    const postId = await blogServices
      .createPostsByBlogId(req.params.blogId, req.body);
    if (!postId) res.sendStatus(HTTP.NOT_FOUND_404);
    else {
      const post = await postsQueryRepository.getPostById(postId);
      if (post) res.status(HTTP.CREATED_201).json(post); // TEST #2.96
    };
  });