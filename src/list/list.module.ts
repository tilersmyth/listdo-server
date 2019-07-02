import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ListSchema } from './list.schema';

import { ListService } from './list.service';
import { ListResolver } from './list.resolver';
import { UserService } from '../auth/user.service';
import { UserSchema } from '../auth/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'List', schema: ListSchema },
      { name: 'User', schema: UserSchema },
    ]),
  ],
  providers: [ListResolver, ListService, UserService],
})
export class ListModule {}
