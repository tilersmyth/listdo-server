import {
  Controller,
  Post,
  UseInterceptors,
  Body,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('send-grid')
export class SendGridController {
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  test(@Body() modelData: any) {
    new Logger().log(modelData);
    return;
  }
}
