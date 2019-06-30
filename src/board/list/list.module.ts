import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ListSchema } from './list.schema';

import { ListService } from './list.service';
import { ListResolver } from './list.resolver';
import { UserService } from '../../auth/user.service';
import { BoardService } from '../board.service';
import { BoardSchema } from '../board.schema';
import { UserSchema } from '../../auth/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'List', schema: ListSchema }]),
    MongooseModule.forFeature([{ name: 'Board', schema: BoardSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  providers: [ListResolver, ListService, UserService, BoardService],
})
export class ListModule {}
