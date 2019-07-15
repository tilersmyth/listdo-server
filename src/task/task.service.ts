import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ClientSession } from 'mongoose';
import { PubSub } from 'graphql-subscriptions';

import { Task } from './interfaces/task.interface';
import { PUBSUB } from '../constants';
import { Email } from '../email/interfaces/email.interface';
import { ListService } from '../list/list.service';

@Injectable()
export class TaskService {
  constructor() // @InjectModel('Task') private readonly taskModel: Model<Task>,
  // @Inject(PUBSUB) readonly pubSub: PubSub,
  // private readonly listService: ListService,
  {}

  public async createFromEmail(
    email: Email,
    session: ClientSession,
  ): Promise<void> {}
}
