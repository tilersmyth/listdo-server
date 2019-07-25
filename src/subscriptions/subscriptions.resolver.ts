import { Resolver, Subscription } from '@nestjs/graphql';
import * as mongoose from 'mongoose';

import { NewTaskDto } from '../task/dto/new-task.dto';
import { SubscriptionsService } from './subscriptions.service';

@Resolver('Subscriptions')
export class SubscriptionsResolver {
  constructor(private readonly subService: SubscriptionsService) {}

  @Subscription(() => NewTaskDto, {
    filter: (payload, _, context) => {
      const userId = mongoose.Types.ObjectId(payload.newTask.user);
      return userId.equals(context.req.session.userId);
    },
  })
  newTask() {
    return this.subService.newTask();
  }
}
