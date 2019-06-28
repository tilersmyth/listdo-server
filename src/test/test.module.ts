import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TestResolver } from './test.resolver';
import { TestSchema } from './test.schema';
import { TestService } from './test.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Test', schema: TestSchema }])],
  providers: [TestResolver, TestService],
})
export class TestModule {}
