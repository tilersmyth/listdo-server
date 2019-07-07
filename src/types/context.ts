import { Request, Response } from 'express';
import { PubSub } from 'graphql-subscriptions';

export interface ExpressContext {
  req: Request;
  res: Response;
  pubSub: PubSub;
}
