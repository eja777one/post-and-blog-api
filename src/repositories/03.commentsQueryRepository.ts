import { ObjectID } from 'bson';
import { Paginator, CommentViewModel, CommentDBModel } from '../models';
import { commentsCollection } from './00.db';

const prepareComment = (input: CommentDBModel) => {
  const obj: CommentViewModel = {
    id: input._id.toString(),
    content: input.content,
    userId: input.userId,
    userLogin: input.userLogin,
    createdAt: input.createdAt
  };
  return obj;
};

export const commentsQueryRepository = {
  async getComment(id: string) {
    const comment = await commentsCollection.findOne({ _id: new ObjectID(id) });
    if (comment) return prepareComment(comment);
    return null;
  },
  async getCommentByQuery(query: any, postId: string)
    : Promise<Paginator<CommentViewModel>> {
    const skip = (query.pageNumber - 1) * query.pageSize;
    const limit = query.pageSize;
    const sortBy = query.sortBy;
    const sortDirection = query.sortDirection === 'asc' ? 1 : -1;
    const sortObj: any = {};
    sortObj[sortBy] = sortDirection

    const items = await commentsCollection.find({ postId: postId })
      .sort(sortObj)
      .limit(limit)
      .skip(skip)
      .toArray();

    const postsCommentsCount = await commentsCollection.countDocuments({ postId: postId })

    const pagesCount = Math.ceil(postsCommentsCount / limit);

    return {
      pagesCount,
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: postsCommentsCount,
      items: items.map((el: any) => prepareComment(el))
    };
  },
};