import { Module } from '@nestjs/common';
import { SubscriptionsResolver } from './subscriptions.resolver';

@Module({
  providers: [SubscriptionsResolver]
})
export class SubscriptionsModule {}
