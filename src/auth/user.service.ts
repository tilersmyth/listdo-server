import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './interfaces/user.interface';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email });
  }

  async findById(id: number): Promise<User> {
    return this.userModel.findById(id);
  }

  async create(input: RegisterDto): Promise<User> {
    const createdUser = new this.userModel(input);
    return createdUser.save();
  }
}
