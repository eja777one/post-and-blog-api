import { BlogViewModel, Paginator, PostViewModel, Query, sortDirection } from './../models';

export const prepareQueries = (query: any) => {
  const queryObj: Query = {
    pageNumber: +query.pageNumber || 1,
    pageSize: +query.pageSize || 10,
    sortBy: query.sortBy || 'createdAt',
    sortDirection: query.sortDirection || sortDirection.desc
  };

  if (query.searchNameTerm) {
    queryObj.searchNameTerm = query.searchNameTerm
  };

  return queryObj;
};

export const prepareBlog = (input: any) => {
  console.log(input)
  const obj = {
    id: input._id.toString(),
    name: input.name,
    description: input.description,
    websiteUrl: input.websiteUrl,
    createdAt: input.createdAt,
  };
  return obj;
};

export const preparePost = (input: any) => {
  const obj = {
    id: input._id.toString(),
    title: input.title,
    shortDescription: input.shortDescription,
    content: input.content,
    blogId: input.blogId,
    blogName: input.blogName,
    createdAt: input.createdAt
  };
  return obj;
};

export const prepareBlogs = (input: any) => {
  const obj: Paginator<BlogViewModel> = {
    pagesCount: input.pagesCount,
    page: input.page,
    pageSize: input.pageSize,
    totalCount: input.totalCount,
    items: input.items.map((el: any) => prepareBlog(el))
  };
  return obj;
};

export const preparePosts = (input: any) => {
  const obj: Paginator<PostViewModel> = {
    pagesCount: input.pagesCount,
    page: input.page,
    pageSize: input.pageSize,
    totalCount: input.totalCount,
    items: input.items.map((el: any) => preparePost(el))
  };
  return obj;
};