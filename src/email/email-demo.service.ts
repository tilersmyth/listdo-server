import { Injectable, Logger } from '@nestjs/common';
import { CreateDemo } from './interfaces/create-demo.interface';

@Injectable()
export class EmailDemoService {
  create(input: CreateDemo): boolean {
    new Logger().log(input);
    return true;
  }
}
