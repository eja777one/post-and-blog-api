import { BlogViewModel, Paginator } from './../models';
import { blogsCollection } from './db';
import { ObjectID } from 'bson';

const prepareBlog = (input: any) => {
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

export const blogsQueryRepository = {
  async getBlogsByQuery(query: any) {
    const skip = (query.pageNumber - 1) * query.pageSize;
    const limit = query.pageSize;
    const sortBy = query.sortBy;
    console.log(query.sortDirection);
    const sortDirection = query.sortDirection === 'asc' ? 1 : -1;
    const sortObj: any = {};
    sortObj[sortBy] = sortDirection
    const findObj = query.searchNameTerm ? { name: new RegExp(query.searchNameTerm, 'i') } : {};

    const items = await blogsCollection.find(findObj)
      .sort(sortObj)
      .limit(limit)
      .skip(skip)
      .toArray();

    const items2 = await blogsCollection.find(findObj).toArray();

    const pagesCount = Math.ceil(items2.length / limit);

    const answer: Paginator<BlogViewModel> = {
      pagesCount,
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: items2.length,
      items: items.map((el: any) => prepareBlog(el))
    }

    return answer;
  },

  async getBlogById(id: string) {
    const blog = await blogsCollection.findOne({ _id: new ObjectID(id) });
    if (blog) return prepareBlog(blog);
    else return null;
  },

  async getBlogs() {
    const blogs = await blogsCollection.find({}).toArray();
    return blogs;
  },
};