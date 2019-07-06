import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { List } from './interfaces/list.interface';
import { CreateListDto } from './dto/create.dto';
import { CreateList } from './interfaces/create.interface';

@Injectable()
export class ListService {
  constructor(@InjectModel('List') private readonly listModel: Model<List>) {}

  public async create(
    input: CreateList,
    userId: string,
  ): Promise<CreateListDto> {
    const list = new this.listModel(input);
    list.board = input.boardId;
    list.user = userId;

    await list.save();

    return { success: true, error: null };
  }

  public async findOneByUser(userId: string, slug: string): Promise<List> {
    return this.listModel.findOne({
      user: userId,
      $or: [{ slug }, { slug: 'default' }],
    });
  }
}
