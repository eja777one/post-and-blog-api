import { Request, Response } from "express";
import { CommentsService } from './../domains/03.commentsService';
import { HTTP } from '../models';

export class CommentsController {

  constructor(protected commentsService: CommentsService) { }

  async updateComment(req: Request<{ commentId: string }>, res: Response) {
    if (!req.user) return res.sendStatus(HTTP.UNAUTHORIZED_401); // TEST #5.3

    const modifiedStatus = await this.commentsService
      .updateComment(req.params.commentId, req.user, req.body);

    res.sendStatus(HTTP[modifiedStatus]);
  }

  async changeLikeStatus(req: Request<{ commentId: string }>, res: Response) {
    if (!req.user) return res.sendStatus(HTTP.UNAUTHORIZED_401);

    const updated = await this.commentsService
      .changeLikeStatus(req.params.commentId, req.body.likeStatus);

    if (!updated) return res.sendStatus(HTTP.NOT_FOUND_404);
    res.sendStatus(HTTP.NO_CONTENT_204);
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