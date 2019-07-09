import { Controller, Post, Logger, Req } from '@nestjs/common';

@Controller('send-grid')
export class SendGridController {
  @Post()
  test(@Req() request: any) {
    if (request.inbound.errors.length > 0) {
      new Logger().warn(request.inbound.errors);
      return;
    }

    new Logger().log('SUCCESS');
    new Logger().debug(request.inbound);
    return;
  }
}
