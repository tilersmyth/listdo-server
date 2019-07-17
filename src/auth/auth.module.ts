import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthService } from './auth.service';
import { UserSchema } from './user.schema';
import { UserService } from './user.service';
import { AuthResolver } from './auth.resolver';
import { ValidationService } from './validation.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  providers: [AuthResolver, AuthService, UserService, ValidationService],
})
export class AuthModule {}
