import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TestModule } from './test/test.module';
import { AuthModule } from './auth/auth.module';
import { BoardModule } from './board/board.module';

@Module({
  imports: [
    TestModule,
    GraphQLModule.forRoot({ autoSchemaFile: 'schema.gql' }),
    MongooseModule.forRoot('mongodb://localhost/listDo'),
    AuthModule,
    BoardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
