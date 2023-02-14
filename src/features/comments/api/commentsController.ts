import { inject, injectable } from 'inversify';
import { Request, Response } from "express";
import { CommentsService } from '../application/commentsService';

@injectable()
export class CommentsController {

  constructor(
    @inject(CommentsService) protected commentsService: CommentsService
  ) { }

  async updateComment(req: Request<{ commentId: string }>, res: Response) {
    const result = await this.commentsService
      .updateComment(req.params.commentId, req.user!, req.body);
    res.sendStatus(result.statusCode);
  }

  async changeLikeStatus(req: Request<{ commentId: string }>, res: Response) {
    const result = await this.commentsService
      .changeLikeStatus(req.params.commentId, req.body.likeStatus, req.user!.id);
    res.sendStatus(result.statusCode);
  }

  async deleteComment(req: Request<{ commentId: string }>, res: Response) {
    const result = await this.commentsService
      .deleteComment(req.params.commentId, req.user!);
    res.sendStatus(result.statusCode);
  }

  async getComment(req: Request<{ commentId: string }>, res: Response) {
    const result = await this.commentsService
      .getComment(req.params.commentId, req.user);
    res.status(result.statusCode).json(result.data);
  }
};