import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { LoginInput } from './inputs/login.input';
import { RegisterInput } from './inputs/register.input';
import { ExpressContext } from '../types/context';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthDto, { nullable: true })
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
