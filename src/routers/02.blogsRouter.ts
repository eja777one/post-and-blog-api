import { Router, Request, Response } from "express";
import { blogServices } from '../domains/02.blogsServices';
import { prepareQueries } from '../application/prepareQuery';
import { checkIsObjectId } from '../middlewares/checkParamMware';
import { checkAuthMware } from '../middlewares/checkAuthMware';
import { postsQueryRepository }
  from '../repositories/04.postsQueryRepository';
import { blogsQueryRepository }
  from '../repositories/02.blogsQueryRepository';
import {
  testBlogsReqBody,
  checkReqBodyMware,
  testPostsReqBodyNoBlogId
} from '../middlewares/checkReqBodyMware';
import {
  BlogInputModel,
  HTTP,
  Paginator,
  BlogViewModel,
  PostViewModel,
  PostInputModelNoId
} from '../models';


export const blogsRouter = Router({});

blogsRouter.get('/', async (
  req: Request,
  res: Response<Paginator<BlogViewModel>>
) => {
  const query = prepareQueries(req.query);
  const blogs = await blogsQueryRepository.getBlogsByQuery(query);
  res.status(HTTP.OK_200).json(blogs); // TEST #2.1, #2.22
});

blogsRouter.post('/',
  checkAuthMware,
  testBlogsReqBody,
  checkReqBodyMware,
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
  testBlogsReqBody,
  checkReqBodyMware,
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

    if (deleted) res.sendStatus(HTTP.NO_CONTENT_204); // TEST #2.21
    else res.sendStatus(HTTP.NOT_FOUND_404);
  });

blogsRouter.get('/:blogId/posts',
  checkIsObjectId,
  async (
    req: Request<{ blogId: string }>,
    res: Response<Paginator<PostViewModel>>
  ) => {
    const blog = await blogsQueryRepository.getBlogById(req.params.blogId);

    if (!blog) {
      return res.sendStatus(HTTP.NOT_FOUND_404);
    } else {
      const query = prepareQueries(req.query);
      const posts = await postsQueryRepository
        .getPostsByBlogId(req.params.blogId, query);
      return res.status(HTTP.OK_200).json(posts); // TEST #2.13, #2.18
    };
  });

blogsRouter.post('/:blogId/posts',
  checkAuthMware,
  checkIsObjectId,
  testPostsReqBodyNoBlogId,
  checkReqBodyMware,
  async (
    req: Request<{ blogId: string }, PostInputModelNoId>,
    res: Response<PostViewModel>
  ) => {

    const postId = await blogServices
      .createPostsByBlogId(req.params.blogId, req.body);

    if (!postId) return res.sendStatus(HTTP.NOT_FOUND_404);

    const post = await postsQueryRepository.getPostById(postId);

    if (post) res.status(HTTP.CREATED_201).json(post); // TEST #2.17
  });