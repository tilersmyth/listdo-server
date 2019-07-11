import { PubSub } from 'graphql-subscriptions';
import { PUBSUB } from '../constants';

export const pubSubService = {
  provide: PUBSUB,
  useValue: new PubSub(),
};
