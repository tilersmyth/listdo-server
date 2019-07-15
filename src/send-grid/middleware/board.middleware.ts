import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';

import { BoardService } from '../../board/board.service';
import { ParseRequest } from '../interfaces/request.interface';

@Injectable()
export class BoardMiddleware implements NestMiddleware {
  constructor(private readonly boardService: BoardService) {}

  async use(
    { mailparser, output }: ParseRequest,
    _: Response,
    next: NextFunction,
  ) {
    if (output.errors.length > 0) {
      next();
      return;
    }

    const { listdo } = mailparser;

    const board = await this.boardService.findBySlug(listdo.board);
    if (!board) {
      output.errors = [
        {
          path: 'inbound_parse_error',
          message: `Board does not exist for path: ${listdo.board}`,
        },
      ];

      next();
      return;
    }

    output.email.board = board;
    next();
  }
}
