import { Controller, Post, Logger, Req } from '@nestjs/common';

import { EmailService } from '../email/email.service';

@Controller('send-grid')
export class SendGridController {
  constructor(private readonly emailService: EmailService) {}

  @Post()
  async test(@Req() request: any) {
    const { payload, errors, warnings } = request.inbound;

    if (errors.length > 0) {
      new Logger('ERROR').warn(errors);
      return true;
    }

    if (warnings.length > 0) {
      new Logger('WARNING').warn(warnings);
    }

    await this.emailService.create(payload);

    return true;
  }
}
