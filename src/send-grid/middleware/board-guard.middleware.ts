import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';

import { BoardService } from '../../board/board.service';
import { ParseRequest } from '../interfaces';

@Injectable()
export class BoardGuardMiddleware implements NestMiddleware {
  constructor(private readonly boardService: BoardService) {}

  async use(req: ParseRequest, _: Response, next: NextFunction) {
    if (req.inbound.errors.length > 0) {
      next();
      return;
    }

    const { listdo } = req.inbound.payload;

    const boardExists = await this.boardService.findBySlug(listdo.boardSlug);
    if (!boardExists) {
      req.inbound.errors = [
        {
          path: 'inbound_parse_error',
          message: `Board does not exist for path: ${listdo.board}`,
        },
      ];

      next();
      return;
    }

    req.inbound.payload.listdo.board = boardExists;
    next();
  }
}
