import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { List } from './interfaces/list.interface';
import { UserService } from '../auth/user.service';
import { User } from '../auth/interfaces/user.interface';
import { CreateListInput } from './inputs/create.input';
import { CreateListDto } from './dto/create.dto';
import { BoardService } from '../board/board.service';
import { Board } from '../board/interfaces/board.interface';
import { ExpressContext } from '../types/context';

@Injectable()
export class ListService {
  constructor(
    @InjectModel('List') private readonly listModel: Model<List>,
    private readonly userService: UserService,
    private readonly boardService: BoardService,
  ) {}

  private async findUserById(id: string): Promise<User> {
    return this.userService.findById(id);
  }

  private async findBoard(boardId: string): Promise<Board> {
    return this.boardService.findById(boardId);
  }

  public async create(
    input: CreateListInput,
    ctx: ExpressContext,
  ): Promise<CreateListDto> {
    const { userId } = ctx.req.session;

    const user = await this.findUserById(userId);

    const board = await this.findBoard(input.boardId);

    if (!board) {
      return {
        success: false,
        error: 'Create list error: board does not exist',
      };
    }

    const list = new this.listModel(input);
    list.board = board.id;
    list.user = user.id;

    await list.save();

    return { success: true, error: null };
  }
}
