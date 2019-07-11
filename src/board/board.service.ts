import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as slugify from 'slug';

import { Board } from './interfaces/board.interface';
import { UserService } from '../auth/user.service';
import { User } from '../auth/interfaces/user.interface';
import { CreateInput } from './inputs/create.input';
import { CreateBoard } from './interfaces/create.interface';
import { AddMemberInput } from './inputs/addMember.input';
import { AddMember } from './interfaces/addMember.interface';
import { ExpressContext } from '../types/context';
import { ListService } from '../list/list.service';

@Injectable()
export class BoardService {
  constructor(
    @InjectModel('Board') private readonly boardModel: Model<Board>,
    private readonly userService: UserService,
    private readonly listService: ListService,
  ) {}

  private async findUserByEmail(email: string): Promise<User> {
    return this.userService.findByEmail(email);
  }

  private async createDefaultList(boardId: string, userId: string) {
    return this.listService.create(
      { boardId, name: 'Default', slug: 'default' },
      userId,
    );
  }

  async findById(id: string): Promise<Board> {
    return this.boardModel.findById(id);
  }

  async findBySlug(slug: string): Promise<Board> {
    return this.boardModel.findOne({ slug });
  }

  public async create(
    input: CreateInput,
    ctx: ExpressContext,
  ): Promise<CreateBoard> {
    const { user } = ctx.req.session;

    Object.assign(input, {
      owner: user.id,
      members: [user.id],
    });

    const board = new this.boardModel(input);

    // to do: ensure slug is unique
    board.slug = slugify(input.name, { lower: true });
    const savedBoard = await board.save();

    // Save board to user schema
    user.boards = [savedBoard.id, ...user.boards];
    await user.save();

    // Create default list unique to user on new board
    await this.createDefaultList(savedBoard.id, user.id);

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

    // Create default list unique to user on new board
    await this.createDefaultList(board.id, user.id);

    return { success: true, error: null };
  }
}
