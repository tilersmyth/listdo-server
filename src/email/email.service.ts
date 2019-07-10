import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Email } from './interfaces/email.interface';

@Injectable()
export class EmailService {
  constructor(
    @InjectModel('Email') private readonly emailModel: Model<Email>,
  ) {}

  public async findByMessageId(messageId: string): Promise<Email> {
    return this.emailModel.findOne({ messageId });
  }
}
