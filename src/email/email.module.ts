import { Module } from '@nestjs/common';
import { EmailDemoService } from './email-demo.service';
import { EmailResolver } from './email.resolver';

@Module({
  providers: [EmailDemoService, EmailResolver],
})
export class EmailModule {}
