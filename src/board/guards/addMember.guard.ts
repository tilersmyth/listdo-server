import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';
import * as mongoose from 'mongoose';

import { BoardService } from '../board.service';

@Injectable()
export class AddMemberGuard implements CanActivate {
  constructor(private readonly boardService: BoardService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);

    const {
      input: { boardId },
    } = ctx.getArgs();

    const board = await this.boardService.findById(boardId);

    if (!board) {
      return false;
    }

    const req: Request = ctx.getContext().req;

    const userId = mongoose.Types.ObjectId(req.session.userId);

    return userId.equals(board.owner);
  }
}
