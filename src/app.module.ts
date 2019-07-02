import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongoModule } from './mongo.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TestModule } from './test/test.module';
import { AuthModule } from './auth/auth.module';
import { BoardModule } from './board/board.module';
import { EmailModule } from './email/email.module';
import { ListModule } from './list/list.module';

@Module({
  imports: [
    MongoModule.forRoot(),
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      context: ({ req, res }) => ({ req, res }),
    }),
    TestModule,
    AuthModule,
    BoardModule,
    ListModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
