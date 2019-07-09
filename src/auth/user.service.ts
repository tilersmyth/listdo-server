import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './interfaces/user.interface';
import { RegisterInput } from './inputs/register.input';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async findUserAuth(email: string): Promise<User> {
    return this.userModel.findOne({ email });
  }

  async count(args: any): Promise<number> {
    return this.userModel.countDocuments({ ...args });
  }

  async find(): Promise<User[]> {
    return this.userModel.find();
  }

  async findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email }).select('-password -salt');
  }

  async findById(id: string): Promise<User> {
    return this.userModel.findById(id).select('-password -salt');
  }

  async create(input: RegisterInput): Promise<User> {
    const createdUser = new this.userModel(input);
    return createdUser.save();
  }
}
