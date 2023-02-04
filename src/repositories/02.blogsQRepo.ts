import { BlogModel } from './00.db';
import { ObjectID } from 'bson';
import { BlogDBModel, BlogViewModel, Paginator, Query } from '../models';

const prepareBlog = (input: BlogDBModel): BlogViewModel => {
  return {
    id: input._id.toString(),
    name: input.name,
    description: input.description,
    websiteUrl: input.websiteUrl,
    createdAt: input.createdAt,
  };
};

export class BlogsQueryRepository {

  async getBlogs(query: Query): Promise<Paginator<BlogViewModel>> {

    const sortBy = query.sortBy;
    const sortDirection = query.sortDirection === 'asc' ? 1 : -1;

    const sortObj: any = {};
    sortObj[sortBy] = sortDirection;

    const findObj = query.searchNameTerm ?
      { name: new RegExp(query.searchNameTerm, 'i') } : {};

    const items = await BlogModel.find(findObj)
      .sort(sortObj)
      .limit(query.pageSize)
      .skip((query.pageNumber - 1) * query.pageSize)
      .lean();

    const searchBlogsCount = await BlogModel.countDocuments(findObj);

    const pagesCount = Math.ceil(searchBlogsCount / query.pageSize);

    return {
      pagesCount,
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: searchBlogsCount,
      items: items.map((el: any) => prepareBlog(el))
    };
  }

  async getBlog(id: string) {
    const blog = await BlogModel.findOne({ _id: new ObjectID(id) });

    return blog ? prepareBlog(blog) : null;
  }
};