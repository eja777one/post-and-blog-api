import { ObjectID } from 'bson';
import { injectable } from 'inversify';
import { CommentModel } from '../../../db';
import { CommentViewModel, CommentDBModel, Query, Paginator, LikeStatus }
  from '../../../models';

const prepareComment = (dbComment: CommentDBModel, userId?: string)
  : CommentViewModel => {

  let status: LikeStatus = 'None';

  const statusesArr = dbComment.usersLikeStatus;

  try {
    status = statusesArr.filter(el => el.userId === userId)[0]?.likeStatus;
  } catch (error) {
    console.log('emptyArr')
  };

  return {
    id: dbComment._id.toString(),
    content: dbComment.content,
    commentatorInfo: {
      userId: dbComment.userId,
      userLogin: dbComment.userLogin,
    },
    createdAt: dbComment.createdAt,
    likesInfo: {
      likesCount: dbComment.likesCount,
      dislikesCount: dbComment.dislikesCount,
      myStatus: status ? status : 'None'
    }
  };
};

@injectable()
export class CommentsQueryRepository {

  async getComment(commentId: string, userId?: string) {
    const comment = await CommentModel
      .findOne({ _id: new ObjectID(commentId) });
    return comment ? prepareComment(comment, userId) : null;
  }

  async getSmartComment(commentId: string, userId?: string) {
    const comment = await CommentModel
      .findOne({ _id: new ObjectID(commentId) });
    return comment ? comment : null;
  }

  async getComments(query: Query, postId: string, userId?: string)
    : Promise<Paginator<CommentViewModel>> {

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
      items: items.map((el: any) => prepareComment(el, userId))
    };
  }
};