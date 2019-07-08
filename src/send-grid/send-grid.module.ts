import { Module } from '@nestjs/common';

import { SendGridController } from './send-grid.controller';

@Module({
  controllers: [SendGridController],
})
export class SendGridModule {}
