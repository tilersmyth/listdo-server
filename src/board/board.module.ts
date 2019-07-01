import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BoardSchema } from './board.schema';
import { BoardService } from './board.service';
import { UserService } from '../auth/user.service';
import { BoardResolver } from './board.resolver';
import { ListModule } from './list/list.module';
import { UserSchema } from '../auth/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Board', schema: BoardSchema },
      { name: 'User', schema: UserSchema },
    ]),
    ListModule,
  ],
  providers: [BoardResolver, BoardService, UserService],
})
export class BoardModule {}
