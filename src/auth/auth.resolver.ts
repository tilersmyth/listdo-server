import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginInput } from './inputs/login.input';
import { RegisterDto } from './dto/register.dto';
import { RegisterInput } from './inputs/register.input';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => LoginDto)
  async login(@Args('input') input: LoginInput) {
    return this.authService.login(input);
  }

  @Mutation(() => RegisterDto)
  async register(@Args('input') input: RegisterInput) {
    return this.authService.register(input);
  }
}
