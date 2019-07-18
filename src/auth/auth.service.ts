import { Injectable } from '@nestjs/common';
import { Request } from 'express';

import { UserService } from './user.service';
import { User } from './interfaces/user.interface';
import { LoginInput } from './inputs/login.input';
import { RegisterInput } from './inputs/register.input';
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';
import { ValidationService } from './validation.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly validationService: ValidationService,
  ) {}

  private async findUser(email: string): Promise<User> {
    return this.userService.findUserAuth(email);
  }

  public async register(input: RegisterInput): Promise<User> {
    const user = await this.findUser(input.email);
    try {
      if (user) {
        throw this.validationService.error('email', 'e-mail already in use');
      }

      return this.userService.create(input);
    } catch (error) {
      throw error;
    }
  }

  public async login(input: LoginInput, req: Request): Promise<User> {
    try {
      const user = await this.findUser(input.email);

      if (!user) {
        throw this.validationService.error(
          'email',
          'invalid email or password',
        );
      }

      const validPassword = user.comparePassword(input.password);

      if (!validPassword) {
        throw this.validationService.error(
          'email',
          'invalid email or password',
        );
      }

      req.session.userId = user.id;

      return user;
    } catch (error) {
      throw error;
    }
  }

  async logout(ctx: ExpressContext): Promise<boolean> {
    await ctx.req.session.destroy(() => {
      return false;
    });
    await ctx.res.clearCookie('listDo');
    return true;
  }
}
