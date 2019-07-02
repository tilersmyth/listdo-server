import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BoardSchema } from './board.schema';
import { BoardService } from './board.service';
import { UserService } from '../auth/user.service';
import { BoardResolver } from './board.resolver';
import { UserSchema } from '../auth/user.schema';
import { ListSchema } from '../list/list.schema';
import { ListService } from '../list/list.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Board', schema: BoardSchema },
      { name: 'User', schema: UserSchema },
      { name: 'List', schema: ListSchema },
    ]),
  ],
  providers: [BoardResolver, BoardService, UserService, ListService],
})
export class BoardModule {}
