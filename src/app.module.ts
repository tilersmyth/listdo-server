import { Module } from '@nestjs/common';
import { GraphQLModule } from './graphql.module';
import { MongoModule } from './mongo.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TestModule } from './test/test.module';
import { AuthModule } from './auth/auth.module';
import { BoardModule } from './board/board.module';
import { EmailModule } from './email/email.module';
import { ListModule } from './list/list.module';
import { TaskModule } from './task/task.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { SendGridModule } from './send-grid/send-grid.module';

@Module({
  imports: [
    MongoModule.forRoot(),
    GraphQLModule.forRootAsync(),
    TestModule,
    AuthModule,
    BoardModule,
    ListModule,
    EmailModule,
    TaskModule,
    SubscriptionsModule,
    SendGridModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
