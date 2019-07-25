import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TaskResolver } from './task.resolver';
import { TaskService } from './task.service';
import { TaskSchema } from './task.schema';
import { pubSubService } from '../subscriptions/pubsub.service';
import { ListSchema } from '../list/list.schema';
import { ListService } from '../list/list.service';
import { UserService } from '../auth/user.service';
import { UserSchema } from '../auth/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Task', schema: TaskSchema },
      { name: 'List', schema: ListSchema },
      { name: 'User', schema: UserSchema },
    ]),
  ],
  providers: [
    TaskResolver,
    TaskService,
    ListService,
    UserService,
    pubSubService,
  ],
})
export class TaskModule {}
