import { Paginator, PostViewModel, Query, PostDBModel } from '../models';
import { PostModel } from './00.db';
import { ObjectID } from 'bson';

const preparePost = (input: PostDBModel): PostViewModel => {
  return {
    id: input._id.toString(),
    title: input.title,
    shortDescription: input.shortDescription,
    content: input.content,
    blogId: input.blogId,
    blogName: input.blogName,
    createdAt: input.createdAt
  };
};

export class PostsQueryRepository {

  async getPosts(query: Query, blogId?: string)
    : Promise<Paginator<PostViewModel>> {

    const sortBy = query.sortBy;
    const sortDirection = query.sortDirection === 'asc' ? 1 : -1;

    const sortObj: any = {};
    sortObj[sortBy] = sortDirection

    const findObj = blogId ? { blogId } : {};

    const items = await PostModel.find(findObj)
      .sort(sortObj)
      .limit(query.pageSize)
      .skip((query.pageNumber - 1) * query.pageSize)
      .lean();

    const postsCount = await PostModel.countDocuments(findObj)

    const pagesCount = Math.ceil(postsCount / query.pageSize);

    return {
      pagesCount,
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: postsCount,
      items: items.map((el: any) => preparePost(el))
    };
  }

  async getPost(id: string) {
    const post = await PostModel.findOne({ _id: new ObjectID(id) });
    return post ? preparePost(post) : null;
  }

  async getAllPostsByBlogId(id: string) {
    const items = await PostModel.find({ 'blogId': id }).lean();
    return items;
  }
};