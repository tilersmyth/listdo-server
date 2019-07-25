import { Injectable, Logger, LoggerService } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { EmailSchema, Email } from './interfaces';
import { TaskService } from '../task/task.service';

@Injectable()
export class EmailService {
  private readonly logger: LoggerService = new Logger('INBOUND PARSE: EMAIL');

  constructor(
    @InjectModel('Email') private readonly emailModel: Model<EmailSchema>,
    private readonly taskService: TaskService,
  ) {}

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

        const savedEmail = await email.save({ session });

        this.logger.log(`saved email: ${savedEmail.id}`);

        await this.taskService.createFromEmail(savedEmail, session);

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
