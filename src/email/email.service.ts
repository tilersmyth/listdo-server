import { Injectable, Logger, LoggerService, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ClientSession } from 'mongoose';
import { PubSub } from 'graphql-subscriptions';

import { EmailSchema, EmailMember, Email } from './interfaces';
import { Task } from '../task/interfaces/task.interface';
import { ListService } from '../list/list.service';
import { NEW_TASK, PUBSUB } from '../constants';

@Injectable()
export class EmailService {
  private readonly logger: LoggerService = new Logger('INBOUND PARSE');

  constructor(
    @InjectModel('Email') private readonly emailModel: Model<EmailSchema>,
    @InjectModel('Task') private readonly taskModel: Model<Task>,
    @Inject(PUBSUB) readonly pubSub: PubSub,
    private readonly listService: ListService,
  ) {}

  private async taskList(userId: string, slug: string) {
    return this.listService.findOneByUser(userId, slug);
  }

  private async createTask(
    member: EmailMember,
    email: EmailSchema,
    session: ClientSession,
  ): Promise<void> {
    const task = new this.taskModel();
    task.user = member.user.id;
    task.email = email.id;
    task.board = email.board.id;
    task.role = member.role;
    const list = await this.taskList(member.user.id, email.list);
    task.list = list.id;
    const savedTask = await task.save({ session });

    await this.pubSub.publish(NEW_TASK, {
      newTask: savedTask,
    });

    this.logger.log(`saved task (${member.role}): ${savedTask.id}`);
  }

  public async findByMessageId(messageId: string): Promise<EmailSchema> {
    return this.emailModel.findOne({ messageId });
  }

  public async create(input: Email) {
    try {
      const session = await this.emailModel.db.startSession();
      session.startTransaction();
      try {
        const email = new this.emailModel(input);
        email.board = input.board;
        email.members = input.members;
        email.payload = input.payload;

        const initiators = input.members.reduce(
          (acc: string[], member: EmailMember) =>
            member.role === 'initiator' ? [member.user.id, ...acc] : acc,
          [],
        );

        email.status.user = initiators;

        const savedEmail = await email.save({ session });
        this.logger.log(`saved email: ${savedEmail.id}`);

        // Add tasks to members
        for (const member of input.members) {
          await this.createTask(member, savedEmail, session);
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
