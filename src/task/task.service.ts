import { Injectable, Inject, LoggerService, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ClientSession } from 'mongoose';
import { PubSub } from 'graphql-subscriptions';

import { TaskSchema, FindBoardTasks } from './interfaces';
import { NEW_TASK, PUBSUB } from '../constants';
import { ListService } from '../list/list.service';
import { EmailMember, EmailSchema } from '../email/interfaces';
import { ExpressContext } from '../types/context';

@Injectable()
export class TaskService {
  private readonly logger: LoggerService = new Logger('INBOUND PARSE: TASK');

  constructor(
    @InjectModel('Task') private readonly taskModel: Model<TaskSchema>,
    @Inject(PUBSUB) readonly pubSub: PubSub,
    private readonly listService: ListService,
  ) {}

  private async taskList(userId: string, slug: string) {
    return this.listService.findOneByUser(userId, slug);
  }

  public async createFromEmail(
    email: EmailSchema,
    session: ClientSession,
  ): Promise<void> {
    const initiators = email.members.reduce(
      (acc: string[], member: EmailMember) =>
        member.role === 'initiator' ? [member.user.id, ...acc] : acc,
      [],
    );

    for (const member of email.members) {
      const task = new this.taskModel();
      task.user = member.user.id;
      task.email = email.id;
      task.board.id = email.board.id;
      task.role = member.role;
      const list = await this.taskList(member.user.id, email.list);
      task.list.id = list.id;
      task.status.user = initiators;
      const savedTask = await task.save({ session });

      this.logger.log(savedTask);

      await this.pubSub.publish(NEW_TASK, {
        newTask: savedTask,
      });

      this.logger.log(`saved task (${member.role}): ${savedTask.id}`);
    }
  }

  public async findTasksByBoard(
    input: FindBoardTasks,
    ctx: ExpressContext,
  ): Promise<TaskSchema[]> {
    try {
      const { user } = ctx.req.session;

      return this.taskModel
        .find({
          user: user.id,
          'board.id': input.board,
          role: input.role,
          'status.type': input.status,
        })
        .populate({
          path: 'email',
          populate: { path: 'members.user' },
        })
        .exec();
    } catch (error) {
      throw error;
    }
  }
}
