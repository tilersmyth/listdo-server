import { Resolver, Mutation, Args, Context, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { LoginInput } from './inputs/login.input';
import { RegisterInput } from './inputs/register.input';
import { ExpressContext } from '../types/context';
import { UserDto } from './dto/user.dto.';
import { UserService } from './user.service';

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

  @Mutation(() => UserDto)
  async register(@Args('input') input: RegisterInput) {
    return this.authService.register(input);
  }

  @Mutation(() => AuthDto, { nullable: true })
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
