import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { UserService } from './user.service';
import { User } from './interfaces/user.interface';
import { LoginInput } from './inputs/login.input';
import { RegisterInput } from './inputs/register.input';
import { Login } from './interfaces/login.interface';
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  private async exists(userData: LoginInput): Promise<User> {
    return this.userService.findByEmail(userData.email);
  }

  public async register(input: RegisterInput): Promise<User> {
    return this.userService.create(input);
  }

  public async login(input: LoginInput, req: Request): Promise<Login> {
    const user = await this.exists(input);

    if (!user) {
      return { status: 404, auth: null };
    }

    const validPassword = user.comparePassword(input.password);

    if (!validPassword) {
      return { status: 403, auth: null };
    }

    req.session.userId = user.id;

    new Logger().log(req.session);

    const payload = `${user.id}`;
    const accessToken = this.jwtService.sign(payload);

    return {
      status: 200,
      auth: {
        expiresIn: 3600,
        token: accessToken,
        userId: payload,
      },
    };
  }

  async logout(ctx: ExpressContext): Promise<boolean> {
    await ctx.req.session.destroy(() => {
      return false;
    });
    await ctx.res.clearCookie('listDo');
    return true;
  }
}
