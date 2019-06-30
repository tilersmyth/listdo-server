import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginInput } from './inputs/login.input';
import { RegisterDto } from './dto/register.dto';
import { RegisterInput } from './inputs/register.input';
import { ExpressContext } from '../types/context';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => RegisterDto)
  async register(@Args('input') input: RegisterInput) {
    return this.authService.register(input);
  }

  @Mutation(() => LoginDto)
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
