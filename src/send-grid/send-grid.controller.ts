import { Controller, Post, Logger, Req } from '@nestjs/common';

import { EmailService } from '../email/email.service';
import { ParseRequest } from './interfaces';
import { Email } from '../email/interfaces';

@Controller('send-grid')
export class SendGridController {
  constructor(private readonly emailService: EmailService) {}

  @Post()
  async test(@Req() request: ParseRequest) {
    const { email, errors, warnings } = request.output;

    if (errors.length > 0) {
      new Logger('ERROR').warn(errors);
      return false;
    }

    if (warnings.length > 0) {
      new Logger('WARNING').warn(warnings);
    }

    // new Logger('PAYLOAD').warn(email);

    await this.emailService.create(email as Email);

    return true;
  }
}
