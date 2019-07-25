import { Module, MiddlewareConsumer } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as multer from 'multer';

import { UserSchema } from '../auth/user.schema';
import { SendGridController } from './send-grid.controller';
import { SendGridService } from './send-grid.service';
import { ParseMiddleware } from './middleware/parse.middleware';
import { UserService } from '../auth/user.service';
import { BoardSchema } from '../board/board.schema';
import { BoardService } from '../board/board.service';
import { ListSchema } from '../list/list.schema';
import { ListService } from '../list/list.service';
import { EmailSchema } from '../email/email.schema';
import { EmailService } from '../email/email.service';
import { TaskSchema } from '../task/task.schema';
import { TaskService } from '../task/task.service';
import { pubSubService } from '../subscriptions/pubsub.service';
import { SenderMiddleware } from './middleware/sender.middleware';
import { BoardMiddleware } from './middleware/board.middleware';
import { MemberMiddleware } from './middleware/member.middleware';
import { ParseUtilService } from './utils/parse-util.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Board', schema: BoardSchema },
      { name: 'List', schema: ListSchema },
      { name: 'Email', schema: EmailSchema },
      { name: 'Task', schema: TaskSchema },
    ]),
  ],
  controllers: [SendGridController],
  providers: [
    SendGridService,
    UserService,
    BoardService,
    ListService,
    EmailService,
    TaskService,
    pubSubService,
    ParseUtilService,
  ],
})
export class SendGridModule {
  private multer = multer();

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        this.multer.array('email'),
        ParseMiddleware,
        SenderMiddleware,
        BoardMiddleware,
        MemberMiddleware,
      )
      .forRoutes('send-grid');
  }
}
