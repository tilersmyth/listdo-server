import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { UserSchema } from './user.schema';
import { UserService } from './user.service';
import { AuthResolver } from './auth.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    JwtModule.register({
      secretOrPrivateKey: 'hidden_secret',
    }),
  ],
  providers: [AuthResolver, AuthService, UserService],
})
export class AuthModule {}
