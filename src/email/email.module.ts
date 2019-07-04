import { Module } from '@nestjs/common';
import { EmailDemoService } from './email-demo.service';
import { EmailResolver } from './email.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailSchema } from './email.schema';
import { UserService } from '../auth/user.service';
import { UserSchema } from '../auth/user.schema';
import { TaskSchema } from '../task/task.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Email', schema: EmailSchema },
      { name: 'User', schema: UserSchema },
      { name: 'Task', schema: TaskSchema },
    ]),
  ],
  providers: [EmailResolver, EmailDemoService, UserService],
})
export class EmailModule {}
