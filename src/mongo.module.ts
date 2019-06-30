import * as dotenv from 'dotenv';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({})
export class MongoModule {
  static forRoot() {
    const env = dotenv.config();
    return MongooseModule.forRoot(env.parsed.MONGO_HOST, {
      useNewUrlParser: true,
    });
  }
}
