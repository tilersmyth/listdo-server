import { Module } from '@nestjs/common';
import { EmailDemoService } from './email-demo.service';
import { EmailResolver } from './email.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailSchema } from './email.schema';
import { UserService } from '../auth/user.service';
import { UserSchema } from '../auth/user.schema';
import { TaskSchema } from '../task/task.schema';
import { ListSchema } from '../list/list.schema';
import { ListService } from '../list/list.service';
import { EmailService } from './email.service';
import { pubSubService } from '../subscriptions/pubsub.service';
import { BoardSchema } from '../board/board.schema';
import { BoardService } from '../board/board.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Email', schema: EmailSchema },
      { name: 'User', schema: UserSchema },
      { name: 'Board', schema: BoardSchema }, // Only used for demo, remove
      { name: 'Task', schema: TaskSchema },
      { name: 'List', schema: ListSchema },
    ]),
  ],
  providers: [
    EmailResolver,
    EmailDemoService,
    UserService,
    ListService,
    EmailService,
    BoardService, // Only used for demo, remove
    pubSubService,
  ],
})
export class EmailModule {}
