import { ObjectID } from 'bson';
import { Paginator, CommentViewModel, CommentDBModel } from '../models';
import { commentsCollection } from './db';

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
  async getCommentByQuery(query: any, postId: string) {
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

    const items2 = await commentsCollection.find({ postId: postId }).toArray();

    const pagesCount = Math.ceil(items2.length / limit);

    const answer: Paginator<CommentViewModel> = {
      pagesCount,
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: items2.length,
      items: items.map((el: any) => prepareComment(el))
    };

    return answer;
  },

  async getComments() {
    return await commentsCollection.find({}).toArray();
  },
};