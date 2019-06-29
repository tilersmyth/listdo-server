import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BoardSchema } from './board.schema';
import { BoardService } from './board.service';
import { UserService } from '../auth/user.service';
import { BoardResolver } from './board.resolver';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Board', schema: BoardSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: BoardSchema }]),
  ],
  providers: [BoardResolver, BoardService, UserService],
})
export class BoardModule {}
