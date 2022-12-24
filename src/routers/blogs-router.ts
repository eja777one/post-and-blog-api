import { Router, Request, Response } from "express";
import { testBlogsReqBody, checkReqBodyMware, testPostsReqBodyNoBlogId }
  from '../middlewares/checkReqBodyMware';
import { testBlogsParamId, testBlogsParamBlogID, checkParamMware }
  from '../middlewares/checkParamMware';
import { testBaseAuth, checkAuthMware } from '../middlewares/checkAuthMware';
import { blogServices } from '../domains/blogs-services';
import { BlogInputModel, HTTP, Paginator, BlogViewModel, PostViewModel, PostInputModelNoId }
  from '../models';
import { prepareBlog, prepareBlogs, preparePost, preparePosts, prepareQueries } from './mappers'

export const blogsRouter = Router({});

blogsRouter.get('/', async (
  req: Request,
  res: Response<Paginator<BlogViewModel>>
) => {
  const query = prepareQueries(req.query);
  const blogs = await blogServices.getBlogsByQuery(query);
  const formatBlogs = prepareBlogs(blogs);

  res.status(HTTP.OK_200).json(formatBlogs); // TEST #2.1, #2.15
});

blogsRouter.post('/',
  testBaseAuth, checkAuthMware,
  testBlogsReqBody, checkReqBodyMware,
  async (
    req: Request<BlogInputModel>,
    res: Response<BlogViewModel>
  ) => {
    const blog = await blogServices.createBlog(req.body);
    if (blog) {
      const formatBlog = prepareBlog(blog);
      res.status(HTTP.CREATED_201).json(formatBlog); // TEST #2.4
    };
  });

blogsRouter.get('/:id',
  testBlogsParamId, checkParamMware,
  async (
    req: Request<{ id: string }>,
    res: Response<BlogViewModel>
  ) => {
    const blog = await blogServices.getBlogById(req.params.id);
    if (blog) {
      const formatBlog = prepareBlog(blog);
      res.status(HTTP.OK_200).json(formatBlog); // TEST #2.6, #2.11
    };
  });

blogsRouter.put('/:id',
  testBaseAuth, checkAuthMware,
  testBlogsParamId, checkParamMware,
  testBlogsReqBody, checkReqBodyMware,
  async (
    req: Request<{ id: string }, BlogInputModel>,
    res: Response
  ) => {
    await blogServices.updateBlog(req.params.id, req.body);
    res.sendStatus(HTTP.NO_CONTENT_204); // TEST #2.10
  });

blogsRouter.delete('/:id',
  testBaseAuth, checkAuthMware,
  testBlogsParamId, checkParamMware,
  async (req: Request<{ id: string }>, res: Response) => {
    await blogServices.deleteBlogById(req.params.id);
    res.sendStatus(HTTP.NO_CONTENT_204); // TEST #2.14
  });

blogsRouter.get('/:blogId/posts',
  testBlogsParamBlogID, checkParamMware,
  async (
    req: Request<{ blogId: string }>,
    res: Response<Paginator<PostViewModel>>
  ) => {
    const query = prepareQueries(req.query);
    const posts = await blogServices.getPostsByBlogId(req.params.blogId, query);
    const formatPosts = preparePosts(posts);
    return res.status(HTTP.OK_200).json(formatPosts); // TEST #2.92, #2.97
  });

blogsRouter.post('/:blogId/posts',
  testBaseAuth, checkAuthMware,
  testBlogsParamBlogID, checkParamMware,
  testPostsReqBodyNoBlogId, checkReqBodyMware,
  async (
    req: Request<{ blogId: string }, PostInputModelNoId>,
    res: Response<PostViewModel>
  ) => {
    const post = await blogServices.createPostsByBlogId(req.params.blogId, req.body);
    if (post) {
      const formatPost = preparePost(post);
      return res.status(HTTP.CREATED_201).json(formatPost); // TEST #2.96
    };
  });