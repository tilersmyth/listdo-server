import { Injectable, Logger, LoggerService, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ClientSession } from 'mongoose';
import { PubSub } from 'graphql-subscriptions';

import { Email } from './interfaces/email.interface';
import { ParsePayload } from '../send-grid/interfaces';
import { Task } from '../task/interfaces/task.interface';
import { ListService } from '../list/list.service';
import { NEW_TASK, PUBSUB } from '../constants';

@Injectable()
export class EmailService {
  private readonly logger: LoggerService = new Logger('INBOUND PARSE');

  constructor(
    @InjectModel('Email') private readonly emailModel: Model<Email>,
    @InjectModel('Task') private readonly taskModel: Model<Task>,
    @Inject(PUBSUB) readonly pubSub: PubSub,
    private readonly listService: ListService,
  ) {}

  private async taskList(userId: string, slug: string) {
    return this.listService.findOneByUser(userId, slug);
  }

  private async createTask(
    userId: string,
    email: Email,
    role: 'initiator' | 'partner' | 'observer' | 'removed',
    session: ClientSession,
  ): Promise<void> {
    const task = new this.taskModel();
    task.user = userId;
    task.email = email.id;
    task.board = email.board;
    task.role = role;
    const list = await this.taskList(userId, email.list);
    task.list = list.id;
    const savedTask = await task.save({ session });

    await this.pubSub.publish(NEW_TASK, {
      newTask: savedTask,
    });

    this.logger.log(`saved task (${role}): ${savedTask.id}`);
  }

  public async findByMessageId(messageId: string): Promise<Email> {
    return this.emailModel.findOne({ messageId });
  }

  public async create(input: ParsePayload) {
    try {
      const session = await this.emailModel.db.startSession();
      session.startTransaction();
      try {
        const email = new this.emailModel(input);
        email.board = input.listdo.board.id;
        email.body.text = input.text;
        email.body.html = input.html;
        email.body.preview = input.text.substring(0, 50);
        email.status.user = input.initiator.user;

        const savedEmail = await email.save({ session });
        this.logger.log(`saved email: ${savedEmail.id}`);

        // Add task to "initiator"
        await this.createTask(
          input.initiator.user.id,
          savedEmail,
          'initiator',
          session,
        );

        // Add task to each "partner"
        for (const partner of input.partner) {
          await this.createTask(
            partner.user.id,
            savedEmail,
            'partner',
            session,
          );
        }

        await session.commitTransaction();

        return true;
      } catch (err) {
        this.logger.error(err);
        await session.abortTransaction();
        return false;
      } finally {
        session.endSession();
      }
    } catch (err) {
      this.logger.error(err);
      this.logger.error('Error creating transaction');
    }
  }
}
