import { Controller, Post, Logger, Req } from '@nestjs/common';

@Controller('send-grid')
export class SendGridController {
  @Post()
  test(@Req() request: any) {
    const { payload, errors, warnings } = request.inbound;

    if (errors.length > 0) {
      new Logger('ERROR').warn(errors);
      return true;
    }

    if (warnings.length > 0) {
      new Logger('WARNING').warn(warnings);
    }

    new Logger('PAYLOAD').debug(payload);
    return true;
  }
}
