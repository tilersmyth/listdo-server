import { Module } from '@nestjs/common';
import { SubscriptionsResolver } from './subscriptions.resolver';
import { pubSubService } from './pubsub.service';
import { SubscriptionsService } from './subscriptions.service';

@Module({
  providers: [SubscriptionsResolver, pubSubService, SubscriptionsService],
})
export class SubscriptionsModule {}
