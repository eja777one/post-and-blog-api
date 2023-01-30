import { ObjectID } from 'bson';
import { Paginator, CommentViewModel, CommentDBModel, Query } from '../models';
import { CommentModel } from './00.db';

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
    const comment = await CommentModel
      .findOne({ _id: new ObjectID(id) });

    return comment ? prepareComment(comment) : null;
  },

  async getCommentByQuery(query: Query, postId: string) {

    const sortBy = query.sortBy;
    const sortDirection = query.sortDirection === 'asc' ? 1 : -1;

    const sortObj: any = {};
    sortObj[sortBy] = sortDirection;

    const items = await CommentModel.find({ postId: postId })
      .sort(sortObj)
      .limit(query.pageSize)
      .skip((query.pageNumber - 1) * query.pageSize)
      .lean();

    const postsCommentsCount = await CommentModel
      .countDocuments({ postId: postId })

    const pagesCount = Math.ceil(postsCommentsCount / query.pageSize);

    return {
      pagesCount,
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: postsCommentsCount,
      items: items.map((el: any) => prepareComment(el))
    };
  },
};