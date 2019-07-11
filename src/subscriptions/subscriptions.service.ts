import { PubSub } from 'graphql-subscriptions';

import { Injectable, Inject } from '@nestjs/common';
import { PUBSUB, NEW_TASK } from '../constants';

@Injectable()
export class SubscriptionsService {
  constructor(@Inject(PUBSUB) readonly pubSub: PubSub) {}

  public newTask() {
    return this.pubSub.asyncIterator(NEW_TASK);
  }
}
