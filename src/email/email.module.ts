import { Module } from '@nestjs/common';
import { EmailResolver } from './email.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailSchema } from './email.schema';
import { UserService } from '../auth/user.service';
import { UserSchema } from '../auth/user.schema';
import { TaskSchema } from '../task/task.schema';
import { EmailService } from './email.service';
import { TaskService } from '../task/task.service';
import { ListService } from '../list/list.service';
import { pubSubService } from '../subscriptions/pubsub.service';
import { ListSchema } from '../list/list.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Email', schema: EmailSchema },
      { name: 'User', schema: UserSchema },
      { name: 'Task', schema: TaskSchema },
      { name: 'List', schema: ListSchema },
    ]),
  ],
  providers: [
    EmailResolver,
    UserService,
    EmailService,
    TaskService,
    ListService,
    pubSubService,
  ],
})
export class EmailModule {}
