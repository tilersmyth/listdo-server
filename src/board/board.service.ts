import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Request } from 'express';
import { Board } from './interfaces/board.interface';
import { UserService } from '../auth/user.service';
import { User } from '../auth/interfaces/user.interface';
import { CreateInput } from './inputs/create.input';
import { CreateBoard } from './interfaces/create.interface';
import { AddMemberInput } from './inputs/addMember.input';
import { AddMember } from './interfaces/addMember.interface';
import { ExpressContext } from '../types/context';

@Injectable()
export class BoardService {
  constructor(
    @InjectModel('Board') private readonly boardModel: Model<Board>,
    private readonly userService: UserService,
  ) {}

  private async findUserById(id: string): Promise<User> {
    return this.userService.findById(id);
  }

  private async findUserByEmail(email: string): Promise<User> {
    return this.userService.findByEmail(email);
  }

  async findById(id: string): Promise<Board> {
    return this.boardModel.findById(id);
  }

  public async create(
    input: CreateInput,
    ctx: ExpressContext,
  ): Promise<CreateBoard> {
    const { userId } = ctx.req.session;

    const owner = await this.findUserById(userId);

    Object.assign(input, { owner: owner.id, members: [userId] });
    const board = new this.boardModel(input);
    const savedBoard = await board.save();

    // Save board to user schema
    owner.boards = [savedBoard.id, ...owner.boards];
    await owner.save();

    return { error: null, board: savedBoard };
  }

  public async addMember(input: AddMemberInput): Promise<AddMember> {
    const board = await this.findById(input.boardId);

    if (!board) {
      return { success: false, error: 'Board does not exist' };
    }

    const user = await this.findUserByEmail(input.email);

    if (!user) {
      return { success: false, error: 'User does not exist' };
    }

    if (user.boards.length > 0 && user.boards.includes(board.id)) {
      return { success: false, error: 'User is already board member' };
    }

    board.members = [user.id, ...board.members];
    await board.save();

    user.boards = [board.id, ...user.boards];
    await user.save();

    return { success: true, error: null };
  }
}