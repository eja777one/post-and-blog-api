import { BlogViewModel, Paginator } from '../models';
import { blogsCollection } from './00.db';
import { ObjectID } from 'bson';

const prepareBlog = (input: any) => {
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
  async getBlogsByQuery(query: any)
    : Promise<Paginator<BlogViewModel>> {
    const skip = (query.pageNumber - 1) * query.pageSize;
    const limit = query.pageSize;
    const sortBy = query.sortBy;
    const sortDirection = query.sortDirection === 'asc' ? 1 : -1;
    const sortObj: any = {};
    sortObj[sortBy] = sortDirection
    const findObj = query.searchNameTerm ? { name: new RegExp(query.searchNameTerm, 'i') } : {};

    const items = await blogsCollection.find(findObj)
      .sort(sortObj)
      .limit(limit)
      .skip(skip)
      .toArray();

    const searchBlogsCount = await blogsCollection.countDocuments(findObj);

    const pagesCount = Math.ceil(searchBlogsCount / limit);

    return {
      pagesCount,
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: searchBlogsCount,
      items: items.map((el: any) => prepareBlog(el))
    }
  },

  async getBlogById(id: string) {
    const blog = await blogsCollection.findOne({ _id: new ObjectID(id) });
    if (blog) return prepareBlog(blog);
    else return null;
  },
};