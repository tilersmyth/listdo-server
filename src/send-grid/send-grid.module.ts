import { Module, MiddlewareConsumer } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as multer from 'multer';

import { UserSchema } from '../auth/user.schema';
import { SendGridController } from './send-grid.controller';
import { SendGridService } from './send-grid.service';
import { ParseMiddleware } from './middleware/parse.middleware';
import { UserService } from '../auth/user.service';
import { AuthGuardMiddleware } from './middleware/auth-guard.middleware';
import { BoardSchema } from '../board/board.schema';
import { BoardService } from '../board/board.service';
import { ListSchema } from '../list/list.schema';
import { ListService } from '../list/list.service';
import { BoardGuardMiddleware } from './middleware/board-guard.middleware';
import { MemberGuardMiddleware } from './middleware/member-guard.middleware';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Board', schema: BoardSchema },
      { name: 'List', schema: ListSchema },
    ]),
  ],
  controllers: [SendGridController],
  providers: [SendGridService, UserService, BoardService, ListService],
})
export class SendGridModule {
  private multer = multer();

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        this.multer.array('email'),
        ParseMiddleware,
        AuthGuardMiddleware,
        BoardGuardMiddleware,
        MemberGuardMiddleware,
      )
      .forRoutes('send-grid');
  }
}
