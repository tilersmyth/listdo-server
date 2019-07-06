import { Injectable, Logger, LoggerService } from '@nestjs/common';
import { Model, ClientSession } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { CreateDemo } from './interfaces/create-demo.interface';
import { Email } from './interfaces/email.interface';
import { Task } from '../task/interfaces/task.interface';
import { ListService } from '../list/list.service';

@Injectable()
export class EmailDemoService {
  private readonly logger: LoggerService = new Logger();

  constructor(
    @InjectModel('Email') private readonly emailModel: Model<Email>,
    @InjectModel('Task') private readonly taskModel: Model<Task>,
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
    this.logger.log(`saved task (${role}): ${savedTask.id}`);
  }

  async createDemo(input: CreateDemo): Promise<boolean> {
    try {
      const session = await this.emailModel.db.startSession();
      session.startTransaction();
      try {
        // First create/save email model
        const email = new this.emailModel();
        email.board = input.board;
        email.intiator = input.payload.from;
        email.partners = input.payload.to;
        email.observers = input.payload.cc;
        email.messageId = input.payload.messageId;
        email.replyId = input.payload.replyId;
        email.subject = input.payload.subject;
        email.body.text = input.payload.bodyText;
        email.body.html = input.payload.bodyHtml;
        email.body.preview = input.payload.bodyText.substring(0, 50);
        email.status.user = input.payload.from;

        const savedEmail = await email.save({ session });
        this.logger.log(`saved email: ${savedEmail.id}`);

        // Add task to "initiator"
        await this.createTask(
          input.payload.from.id,
          savedEmail,
          'initiator',
          session,
        );

        // Add task to each "partner"
        for (const user of input.payload.to) {
          await this.createTask(user.id, savedEmail, 'partner', session);
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
