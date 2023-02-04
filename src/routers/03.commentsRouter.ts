import { Router, Request, Response } from "express";
import { checkIsObjectId } from '../middlewares/checkParamMware';
import { authMware } from '../middlewares/authMware';
import { checkReqBodyMware, testCommentBody }
  from '../middlewares/checkReqBodyMware';
import { CommentsService } from '../domains/03.commentsService';
import { HTTP } from '../models';

export const commentsRouter = Router({});

class CommentsController {

  commentsService: CommentsService;

  constructor() {
    this.commentsService = new CommentsService();
  }

  async updateComment(req: Request<{ commentId: string }>, res: Response) {
    if (!req.user) return res.sendStatus(HTTP.UNAUTHORIZED_401); // TEST #5.3

    const modifiedStatus = await this.commentsService
      .updateComment(req.params.commentId, req.user, req.body);

    res.sendStatus(HTTP[modifiedStatus]);
  }

  async deleteComment(req: Request<{ commentId: string }>, res: Response) {
    if (!req.user) return res.sendStatus(HTTP.UNAUTHORIZED_401);

    const deletedStatus = await this.commentsService
      .deleteComment(req.params.commentId, req.user);

    res.sendStatus(HTTP[deletedStatus]);
  }

  async getComment(req: Request<{ commentId: string }>, res: Response) {
    const comment = await this.commentsService.getComment(req.params.commentId);
    if (!comment) return res.sendStatus(HTTP.NOT_FOUND_404); // TEST #5.7, #5.12
    res.status(HTTP.OK_200).json(comment); // TEST #5.6
  }
};

const commentsController = new CommentsController();

commentsRouter.put('/:commentId',
  authMware,
  checkIsObjectId,
  testCommentBody,
  checkReqBodyMware,
  commentsController.updateComment.bind(commentsController));

commentsRouter.delete('/:commentId',
  authMware,
  checkIsObjectId,
  commentsController.deleteComment.bind(commentsController));

commentsRouter.get('/:commentId',
  checkIsObjectId,
  commentsController.getComment.bind(commentsController));