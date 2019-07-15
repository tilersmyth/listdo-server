import { Injectable, Logger, LoggerService, Inject } from '@nestjs/common';
import { Model, ClientSession } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PubSub } from 'graphql-subscriptions';

import { CreateDemo } from './interfaces/create-demo.interface';
import { EmailSchema, EmailMember } from './interfaces';
import { Task } from '../task/interfaces/task.interface';
import { ListService } from '../list/list.service';
import { NEW_TASK, PUBSUB } from '../constants';
import { BoardService } from '../board/board.service';

@Injectable()
export class EmailDemoService {
  private readonly logger: LoggerService = new Logger();

  constructor(
    @InjectModel('Email') private readonly emailModel: Model<EmailSchema>,
    @InjectModel('Task') private readonly taskModel: Model<Task>,
    @Inject(PUBSUB) private readonly pubSub: PubSub,
    private readonly listService: ListService,
    private readonly boardService: BoardService,
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

  async createDemo(input: CreateDemo): Promise<boolean> {
    try {
      const session = await this.emailModel.db.startSession();
      session.startTransaction();
      try {
        // First create/save email model
        const email = new this.emailModel();

        const board = await this.boardService.findById(input.board);

        if (!board) {
          throw new Error(`Board not found with id: ${input.board}`);
        }

        email.board = board.id;
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
