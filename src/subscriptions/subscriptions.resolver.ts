import { Resolver, Subscription, Context } from '@nestjs/graphql';
import * as mongoose from 'mongoose';

import { NewTaskDto } from '../task/dto/newTask.dto';
import { ExpressContext } from '../types/context';
import { NEW_TASK } from '../constants';

@Resolver('Subscriptions')
export class SubscriptionsResolver {
  @Subscription(() => NewTaskDto, {
    filter: (payload, _, context) => {
      const userId = mongoose.Types.ObjectId(payload.newTask.user);
      return userId.equals(context.req.session.userId);
    },
  })
  newTask(_: any, @Context() { pubSub }: ExpressContext) {
    return pubSub.asyncIterator(NEW_TASK);
  }
}
