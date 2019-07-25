import { Resolver, Mutation, Args, Context, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginInput } from './inputs/login.input';
import { RegisterInput } from './inputs/register.input';
import { ExpressContext } from '../types/context';
import { UserDto } from './dto/user.dto.';
import { UserService } from './user.service';
import { AuthGuard } from './guards/auth.guard';
import { UserEmailInput } from './inputs/user-email.input';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Query(() => [UserDto])
  async allUsers() {
    return this.userService.find();
  }

  @Query(() => UserDto, { nullable: true })
  @UseGuards(AuthGuard)
  async findUserByEmail(@Args('input') input: UserEmailInput) {
    return await this.userService.findByEmail(input.email);
  }

  @Mutation(() => UserDto)
  async register(@Args('input') input: RegisterInput) {
    return this.authService.register(input);
  }

  @Mutation(() => UserDto)
  async login(
    @Args('input') input: LoginInput,
    @Context() ctx: ExpressContext,
  ) {
    return this.authService.login(input, ctx.req);
  }

  @Mutation(() => Boolean)
  async logout(@Context() ctx: ExpressContext) {
    return this.authService.logout(ctx);
  }
}
